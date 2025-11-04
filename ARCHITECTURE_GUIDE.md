# ProOmo Application Architecture Guide

## 🏗️ **How the Application Works**

### **Frontend (Web Interface)**
- **Port**: 3000
- **URL**: `http://localhost:3000`
- **Technology**: Next.js + Tailwind CSS
- **Purpose**: User-facing web interface
- **Status**: ✅ Primary access point

### **Backend (API Server)**  
- **Port**: 8000
- **Technology**: Django + PostgreSQL
- **Purpose**: API endpoints and data processing
- **Status**: ✅ Service layer

## 🔄 **Current Redirect Behavior**

When you visit `http://localhost:8000/` → **Auto-redirects to** `http://localhost:3000`

This is **by design** because:
1. Users should access the web interface through the frontend
2. Backend serves API data, not web pages
3. Prevents confusion between frontend and backend URLs

## 🌐 **How to Access Backend Services**

### **1. Direct API Endpoints** (No Redirect)
访问这些URL不会重定向：
```
http://localhost:8000/api/
http://localhost:8000/api/auth/  (if exists)
http://localhost:8000/admin/
```

### **2. API Access Examples**
- User registration: `POST http://localhost:8000/api/register/`
- User login: `POST http://localhost:8000/api/login/`
- Profile data: `GET http://localhost:8000/api/profile/`

### **3. Admin Panel**
```
http://localhost:8000/admin/
```
(Login with Django superuser credentials)

## 🎯 **Recommended Usage Pattern**

### **For Users:**
- **Always use**: `http://localhost:3000` (web interface)
- **Backend is automatic**: Frontend handles all API calls

### **For Developers:**
- **Web development**: `http://localhost:3000`
- **API testing**: `http://localhost:8000/api/`
- **Database admin**: `http://localhost:8000/admin/`

## ✅ **This is Working Correctly!**

The redirect is intentional and shows the application architecture is properly configured.