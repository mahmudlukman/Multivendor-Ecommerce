import express from 'express';
import { authorizeRoles, isAuthenticated, isSeller } from '../middleware/auth';
import { getAdminDashboardData, getSellerDashboardData, getUserDashboardData } from '../controllers/analytics';

const analyticsRouter = express.Router();

analyticsRouter.get('/user-dashboard', isAuthenticated, getUserDashboardData);
analyticsRouter.get('/seller-dashboard', isSeller, getSellerDashboardData);
analyticsRouter.get('/admin-dashboard', isAuthenticated, authorizeRoles("admin"), getAdminDashboardData);


export default analyticsRouter;
