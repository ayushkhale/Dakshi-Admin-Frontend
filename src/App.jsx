import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Auth from "./Auth/Auth";
import Forgotpass from './Auth/Forgotpass';
import ProtectedRoute from "./Context/ProtectedRoute";

import Sidebar from "./Components/Sidebar";
import Dashboard from "./Pages/Dashboard";
import ProfileCard from "./Components/ProfileCard";
import EditProfile from "./Components/Editprofile";

import AllOffer from "./Pages/Docs/AllOffer";
import AllInvoices from "./Pages/Docs/AllInvoices";
import AllCertificates from "./Pages/Docs/AllCertificates";
import AllidCards from "./Pages/Docs/AllidCards";
import AllEvents from "./Pages/Docs/AllEvents";

import Certificate from "./Pages/Generate/Certificate";
import GenerateID from "./Pages/Generate/IDgen";
import OfferLetter from "./Pages/Generate/OfferLetter";
import SlipGenerator from "./Pages/Generate/SlipGenerator";

import Addevents from "./Pages/Update/Addevents";
import Team from "./Pages/Update/Team";
import Partners from "./Pages/Update/Partners";

import DeleteEvents from "./Pages/Delete/DeleteEvents";
import DeletePartner from "./Pages/Delete/DeletePartner";
import DeletePrograms from "./Pages/Delete/DeletePrograms";
import DeleteTeam from "./Pages/Delete/DeleteTeam";

import InternshipForm from "./Pages/Responses/InternshipForm"
import ContactForm from "./Pages/Responses/ContactForm";
import AddPrograms from "./Pages/Update/AddPrograms";


const AppWrapper = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); 
  }, []);

  const noSidebarRoutes = ["/login", "/signup", "/auth", "/forgotpass"];
  const shouldShowSidebar = isAuthenticated && !noSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col md:flex-row h-full font-Vietnam bg-gray-900">
      {shouldShowSidebar && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
      <main className="flex-1 md:m-5 sm:items-center">
        <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth" element={<Auth />} /> 
          <Route path="/forgotpass" element={<Forgotpass />} />
          {/* <Route path="/sidebar" element={<Sidebar />} /> */}
      
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/certificate" element={<Certificate />} />
            <Route path="/generate-id" element={<GenerateID />} />
            <Route path="/offer-letter" element={<OfferLetter />} />
            <Route path="/slip" element={<SlipGenerator />} />
            
            <Route path="/addevents" element={<Addevents />} />
            <Route path="/addprograms" element={<AddPrograms />} />
            <Route path="/team" element={<Team />} />
            <Route path="/partners" element={<Partners />} />

            <Route path="/delete-events" element={<DeleteEvents />} />
            <Route path="/delete-team" element={<DeleteTeam />} />
            <Route path="/delete-partners" element={<DeletePartner />} />
            <Route path="/delete-programs" element={<DeletePrograms />} />

            <Route path="/ContactForm" element={<ContactForm />} />
            <Route path="/InternshipForm" element={<InternshipForm />} />

            <Route path="/profilecard" element={<ProfileCard />} />
            <Route path="/editprofile" element={<EditProfile />} />
            
            <Route path="/all-certificate" element={<AllCertificates />} />
            <Route path="/all-IdCards" element={<AllidCards />} />
            <Route path="/all-offer-letter" element={<AllOffer />} />
            <Route path="/all-Invoices" element={<AllInvoices />} />

    
          </Route>
          <Route path="*" element={isAuthenticated ? <Dashboard /> : <Login />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
