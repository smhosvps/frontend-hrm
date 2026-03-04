import { HashRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFoundScreen from "./screens/NotFoundScreen";
import IsNotLoginAuth from "./redux/features/auth/IsNotLoginAuth";
import SignInScreen from "./screens/auth/SignInScreen";
import ForgotPasswordScreen from "./screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/auth/ResetPasswordScreen";
import AdminRoute from "./redux/features/auth/AdminRoutes";
import { setCredentials } from "./redux/features/auth/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetUserQuery } from "./redux/api/apiSlice";
import { Loader } from "lucide-react";
import AdminLayout from "./screens/screenlayouts/AdminLayout";
import UserDetails from "./screens/admin/accounts/UserDetails";
import RegisterScreen from "./screens/auth/RegisterScreen";
import OTPVerificationScreen from "./screens/auth/OTPVerificationScreen";
import PastorLayout from "./screens/screenlayouts/PastorLayout";
import PastorHomePage from "./screens/pastors/PastorHomePage";
import AdminNotificationList from "./screens/notifications/AdminNotificationList";
import AdminNotificationCreate from "./screens/notifications/AdminNotificationCreate";
import AdminNotificationDetail from "./screens/notifications/AdminNotificationDetail";
import UserNotificationList from "./screens/notifications/UserNotificationList";
import ManageSchedule from "./screens/admin/schedule/ManageSchedule";
import UserSchedules from "./screens/admin/schedule/UserSchedules";
import UserProfileSettings from "./screens/admin/UserProfileSettings";
import AdminMeetingsDashboard from "./screens/admin/zoom/AdminCreateMeeting";
import MeetingCreationForm from "./screens/admin/zoom/MeetingCreationForm";
import PaticipantMeetingJoin from "./screens/admin/zoom/PaticipantMeetingJoin";
import UserMeetings from "./screens/admin/zoom/UserMeetings";
import UserManagement from "./screens/admin/accounts/UserManagement";
import AddAccount from "./screens/admin/accounts/AddAccount";


function App() {
  const dispatch = useDispatch();
  const { data: user, isLoading } = useGetUserQuery();

  useEffect(() => {
    if (user) {
      dispatch(
        setCredentials({ user, token: localStorage.getItem("token") || "" })
      );
    }
  }, [user, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Loader className="animate-spin text-blue-600" size={64} />
        </div>
      </div>
    );
  }
  return (
    <>
    <HashRouter>
        {/* <Header /> */}
        <Routes>
          <Route path="*" element={<NotFoundScreen />} />
          <Route element={<IsNotLoginAuth />}>
            <Route path="/" element={<SignInScreen />} />
            <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
            <Route path="/reset-password" element={<ResetPasswordScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route
              path="/otp-verification"
              element={<OTPVerificationScreen />}
            />
          </Route>

          {/* pastors */}
          <Route element={<AdminRoute allowedRoles={["pastor"]} />}>
            <Route path="/pastors-dashboard" element={<PastorLayout />}>
              <Route index element={<PastorHomePage />} />
              <Route path="notifications" element={<UserNotificationList />} />
              <Route path="events" element={<UserSchedules />} />
              <Route path="profile" element={<UserProfileSettings />} />
              <Route path="meeting-list" element={<UserMeetings />} />
              <Route
                path="meeting/:meetingId"
                element={<PaticipantMeetingJoin />}
              />
            </Route>
          </Route>
          <Route
            element={<AdminRoute allowedRoles={["pastor", "admin staff"]} />}
          >
            <Route
              path="/dashboard-hr-admin"
              element={<PastorLayout />}
            ></Route>
          </Route>
          {/* operative */}
          <Route
            element={<AdminRoute allowedRoles={["pastor", "operatives"]} />}
          >
            <Route
              path="/dashboard-operatives"
              element={<PastorLayout />}
            ></Route>
          </Route>
          {/* adhoc */}
          <Route element={<AdminRoute allowedRoles={["pastor", "adhoc"]} />}>
            <Route path="/dashboard-adhoc" element={<PastorLayout />}></Route>
          </Route>
          {/* <Route
            element={
              <AdminRoute allowedRoles={["Super Admin", "admin", "pastors"]} />
            }
          > */}
          <Route path="/dashboard" element={<AdminLayout />}>
            <Route
              path="manage-notification"
              element={<AdminNotificationList />}
            />
            <Route
              path="create-notification"
              element={<AdminNotificationCreate />}
            />
            <Route
              path="detail-notification/:id"
              element={<AdminNotificationDetail />}
            />
            <Route path="manage-user" element={<UserManagement />} />
             <Route path="user-details/:id" element={<UserDetails />} />
              <Route path="admin-add-account" element={<AddAccount />} />
            
            <Route path="manage-schedule" element={<ManageSchedule />} />
            <Route path="zoom-meetings" element={<AdminMeetingsDashboard />} />
            <Route
              path="create-zoom-meetings"
              element={<MeetingCreationForm />}
            />
          </Route>
          {/* </Route> */}
        </Routes>
        </HashRouter>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
