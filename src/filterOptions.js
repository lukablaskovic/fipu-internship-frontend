import { ActivityEventMappings } from "./helpers/maps";

const transformedEvents = ActivityEventMappings.events.map((event) => ({
  id: event.activity_id,
  label: event.activity_id,
  icon: event.icon,
}));

export const latestEvents = [
  transformedEvents,
  [
    {
      label: "Spremi",
    },

    {
      label: "Resetiraj",
    },
  ],
];
