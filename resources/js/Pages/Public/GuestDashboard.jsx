import React from 'react';
import DashboardContent from "./Partials/DashboardContent";
import GuestDashboardLayout from "@/Layouts/GuestDashboardLayout";
import { Head } from '@inertiajs/react';

function GuestDashboard() {
  return (
    <GuestDashboardLayout>
        <Head title="Dashboard" />
        <DashboardContent/>
    </GuestDashboardLayout>
  )
}

export default GuestDashboard