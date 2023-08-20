import { mdiMonitor, mdiSquareEditOutline, mdiTable } from "@mdi/js";

export default [
  {
    to: "/dashboard",
    icon: mdiMonitor,
    label: "Nadzorna ploča",
  },
  {
    to: "/tables",
    label: "Servisi",
    icon: mdiTable,
  },
  {
    to: "/forms",
    label: "PDF Builder",
    icon: mdiSquareEditOutline,
  },
];
