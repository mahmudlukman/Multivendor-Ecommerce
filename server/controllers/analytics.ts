import { Request, Response, NextFunction } from 'express';
import { catchAsyncError } from '../middleware/catchAsyncErrors';
import ErrorHandler from '../utils/errorHandler';
import User from '../models/User';
import Order from '../models/Order';
import Product from '../models/Product';
import Event from '../models/Event';
import Shop from '../models/Shop';
import { ORDER_STATUSES } from '../utils/order';

// @desc    Get User Dashboard Data
// @route   GET /api/v1/dashboard/
// @access  Private (User-specific)
export const getUserDashboardData = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return next(new ErrorHandler('User not authenticated', 401));
      }

      // Fetch statistics
      const totalOrders = await Order.countDocuments({ user: userId });
      const pendingOrders = await Order.countDocuments({
        user: userId,
        status: ORDER_STATUSES.PROCESSING,
      });
      const completedOrders = await Order.countDocuments({
        user: userId,
        status: ORDER_STATUSES.DELIVERED,
      });
      const refundOrders = await Order.countDocuments({
        user: userId,
        status: ORDER_STATUSES.PROCESSING_REFUND,
      });

      // Order status distribution
      const orderStatuses = [
        ORDER_STATUSES.PROCESSING,
        ORDER_STATUSES.PAID,
        ORDER_STATUSES.DELIVERED,
        ORDER_STATUSES.PROCESSING_REFUND,
        ORDER_STATUSES.REFUND_SUCCESS,
      ];
      const orderDistributionRaw = await Order.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);
      const orderDistribution = orderStatuses.reduce(
        (acc: Record<string, number>, status) => {
          const formattedKey = status.replace(/\s+/g, '');
          acc[formattedKey] =
            orderDistributionRaw.find((item) => item._id === status)?.count || 0;
          return acc;
        },
        {} as Record<string, number>
      );
      orderDistribution['All'] = totalOrders;

      // Payment status distribution
      const paymentStatuses = ['Pending', 'Succeeded', 'Failed'];
      const paymentDistributionRaw = await Order.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: '$paymentInfo.status',
            count: { $sum: 1 },
          },
        },
      ]);
      const paymentDistribution = paymentStatuses.reduce(
        (acc: Record<string, number>, status) => {
          const formattedKey = status.replace(/\s+/g, '');
          acc[formattedKey] =
            paymentDistributionRaw.find((item) => item._id === status)?.count || 0;
          return acc;
        },
        {} as Record<string, number>
      );

      // Recent 10 orders
      const recentOrders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('cart totalPrice status paymentInfo createdAt')
        .populate({
          path: 'cart.productId',
          select: 'name images discountPrice',
        });

      res.status(200).json({
        success: true,
        statistics: {
          totalOrders,
          pendingOrders,
          completedOrders,
          refundOrders,
        },
        charts: {
          orderDistribution,
          paymentDistribution,
        },
        recentOrders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// @desc    Get Seller Dashboard Data
// @route   GET /api/v1/dashboard/seller
// @access  Private (Seller-specific)
export const getSellerDashboardData = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sellerId = req.seller?._id;
      if (!sellerId) {
        return next(new ErrorHandler('Seller not authenticated', 401));
      }

      const shop = await Shop.findById(sellerId);
      if (!shop) {
        return next(new ErrorHandler('Shop not found', 404));
      }

      // Fetch statistics
      const totalProducts = await Product.countDocuments({ shopId: sellerId });
      const totalEvents = await Event.countDocuments({ shopId: sellerId });
      const totalOrders = await Order.countDocuments({ 'cart.shopId': sellerId });
      const totalSales = await Order.aggregate([
        { $match: { 'cart.shopId': sellerId, status: ORDER_STATUSES.DELIVERED } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]);
      const pendingOrders = await Order.countDocuments({
        'cart.shopId': sellerId,
        status: ORDER_STATUSES.PROCESSING,
      });
      const refundOrders = await Order.countDocuments({
        'cart.shopId': sellerId,
        status: ORDER_STATUSES.PROCESSING_REFUND,
      });

      // Order status distribution
      const orderStatuses = [
        ORDER_STATUSES.PROCESSING,
        ORDER_STATUSES.PAID,
        ORDER_STATUSES.DELIVERED,
        ORDER_STATUSES.PROCESSING_REFUND,
        ORDER_STATUSES.REFUND_SUCCESS,
      ];
      const orderDistributionRaw = await Order.aggregate([
        { $match: { 'cart.shopId': sellerId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);
      const orderDistribution = orderStatuses.reduce(
        (acc: Record<string, number>, status) => {
          const formattedKey = status.replace(/\s+/g, '');
          acc[formattedKey] =
            orderDistributionRaw.find((item) => item._id === status)?.count || 0;
          return acc;
        },
        {} as Record<string, number>
      );
      orderDistribution['All'] = totalOrders;

      // Product stock levels
      const stockLevels = ['Low', 'Medium', 'High'];
      const stockThresholds = { low: 10, medium: 50 }; // Define thresholds
      const productStockLevelsRaw = await Product.aggregate([
        { $match: { shopId: sellerId } },
        {
          $group: {
            _id: {
              $cond: [
                { $lte: ['$stock', stockThresholds.low] },
                'Low',
                {
                  $cond: [
                    { $lte: ['$stock', stockThresholds.medium] },
                    'Medium',
                    'High',
                  ],
                },
              ],
            },
            count: { $sum: 1 },
          },
        },
      ]);
      const productStockLevels = stockLevels.reduce(
        (acc: Record<string, number>, level) => {
          acc[level] =
            productStockLevelsRaw.find((item) => item._id === level)?.count || 0;
          return acc;
        },
        {} as Record<string, number>
      );

      // Recent 10 orders
      const recentOrders = await Order.find({ 'cart.shopId': sellerId })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('cart totalPrice status paymentInfo createdAt')
        .populate({
          path: 'cart.productId',
          select: 'name images discountPrice',
        });

      // Recent 5 active events
      const recentEvents = await Event.find({
        shopId: sellerId,
        Finish_Date: { $gte: new Date() },
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name discountPrice stock sold_out createdAt');

      res.status(200).json({
        success: true,
        statistics: {
          totalProducts,
          totalEvents,
          totalOrders,
          totalSales: totalSales[0]?.total || 0,
          pendingOrders,
          refundOrders,
        },
        charts: {
          orderDistribution,
          productStockLevels,
        },
        recentItems: {
          orders: recentOrders,
          events: recentEvents,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// @desc    Get Admin Dashboard Data
// @route   GET /api/v1/dashboard/admin
// @access  Private (Admin-specific)
export const getAdminDashboardData = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return next(new ErrorHandler('Admin not authenticated', 401));
      }

      // Fetch statistics
      const totalUsers = await User.countDocuments({ role: 'user' });
      const totalSellers = await Shop.countDocuments();
      const totalProducts = await Product.countDocuments();
      const totalEvents = await Event.countDocuments();
      const totalOrders = await Order.countDocuments();
      const totalSales = await Order.aggregate([
        { $match: { status: ORDER_STATUSES.DELIVERED } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]);
      const refundOrders = await Order.countDocuments({
        status: ORDER_STATUSES.PROCESSING_REFUND,
      });

      // Order status distribution
      const orderStatuses = [
        ORDER_STATUSES.PROCESSING,
        ORDER_STATUSES.PAID,
        ORDER_STATUSES.DELIVERED,
        ORDER_STATUSES.PROCESSING_REFUND,
        ORDER_STATUSES.REFUND_SUCCESS,
      ];
      const orderDistributionRaw = await Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);
      const orderDistribution = orderStatuses.reduce(
        (acc: Record<string, number>, status) => {
          const formattedKey = status.replace(/\s+/g, '');
          acc[formattedKey] =
            orderDistributionRaw.find((item) => item._id === status)?.count || 0;
          return acc;
        },
        {} as Record<string, number>
      );
      orderDistribution['All'] = totalOrders;

      // Product category distribution
      const categoryDistributionRaw = await Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]);
      const categoryDistribution = categoryDistributionRaw.reduce(
        (acc: Record<string, number>, item) => {
          acc[item._id || 'Uncategorized'] = item.count;
          return acc;
        },
        {} as Record<string, number>
      );

      // Recent 10 orders
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('cart totalPrice status paymentInfo createdAt')
        .populate({
          path: 'cart.productId',
          select: 'name images discountPrice',
        })
        .populate('user', 'name email');

      // Recent 5 products
      const recentProducts = await Product.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name discountPrice stock sold_out createdAt')
        .populate('shopId', 'name');

      // Recent 5 events
      const recentEvents = await Event.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name discountPrice stock sold_out createdAt')
        .populate('shopId', 'name');

      res.status(200).json({
        success: true,
        statistics: {
          totalUsers,
          totalSellers,
          totalProducts,
          totalEvents,
          totalOrders,
          totalSales: totalSales[0]?.total || 0,
          refundOrders,
        },
        charts: {
          orderDistribution,
          categoryDistribution,
        },
        recentItems: {
          orders: recentOrders,
          products: recentProducts,
          events: recentEvents,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);