import type { Metadata } from "next";

import type { Viewport } from "next";



import { LockedDeviceExperience } from "./LockedDeviceExperience";



export const metadata: Metadata = {

  title: "Cerca",

  description:
    "Promos y beneficios cerca de ti, dentro de DeUna.",

};



export const viewport: Viewport = {

  width: "device-width",

  initialScale: 1,

  maximumScale: 1,

  themeColor: "#5D2A8E",

};



export default function SmartNotificationsPage() {

  return <LockedDeviceExperience />;

}

