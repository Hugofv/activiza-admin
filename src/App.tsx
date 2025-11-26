import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";
import AccountsList from "./pages/Accounts/AccountsList";
import AccountForm from "./pages/Accounts/AccountForm";
import PlatformUsersList from "./pages/PlatformUsers/PlatformUsersList";
import PlatformUserForm from "./pages/PlatformUsers/PlatformUserForm";
import FeaturesList from "./pages/Features/FeaturesList";
import FeatureForm from "./pages/Features/FeatureForm";
import PlansList from "./pages/Plans/PlansList";
import PlanForm from "./pages/Plans/PlanForm";
import QualificationsList from "./pages/Qualifications/QualificationsList";
import QualificationForm from "./pages/Qualifications/QualificationForm";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Auth Routes - Redirect if authenticated */}
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />

          {/* Protected Routes - Require authentication */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />

            {/* Accounts */}
            <Route path="/accounts" element={<AccountsList />} />
            <Route path="/accounts/new" element={<AccountForm />} />
            <Route path="/accounts/:id/edit" element={<AccountForm />} />

            {/* Platform Users */}
            <Route path="/platform-users" element={<PlatformUsersList />} />
            <Route path="/platform-users/new" element={<PlatformUserForm />} />
            <Route path="/platform-users/:id/edit" element={<PlatformUserForm />} />

            {/* Features */}
            <Route path="/features" element={<FeaturesList />} />
            <Route path="/features/new" element={<FeatureForm />} />
            <Route path="/features/:id/edit" element={<FeatureForm />} />

            {/* Plans */}
            <Route path="/plans" element={<PlansList />} />
            <Route path="/plans/new" element={<PlanForm />} />
            <Route path="/plans/:id/edit" element={<PlanForm />} />

            {/* Qualifications */}
            <Route path="/qualifications" element={<QualificationsList />} />
            <Route path="/qualifications/new" element={<QualificationForm />} />
            <Route path="/qualifications/:id/edit" element={<QualificationForm />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
