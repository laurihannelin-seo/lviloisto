import profiles from "../content/cms/contact-people.json";

export const contactPeople = [
  { id: "matias", name: "Matias Ryynänen", initials: "MR", phone: "046 921 4415", tel: "tel:+358469214415", email: "mailto:matias.ryynanen@lviloisto.fi", ...profiles.matias },
  { id: "miro", name: "Miro Sorjonen", initials: "MS", phone: "050 479 6544", tel: "tel:+358504796544", email: "mailto:miro.sorjonen@lviloisto.fi", ...profiles.miro },
] as const;

export type ContactPerson = (typeof contactPeople)[number];

export const findContactPerson = (group: { id?: string; items: { href?: string }[] }) =>
  contactPeople.find((person) => person.id === group.id || group.items.some((item) => item.href === person.tel || item.href === person.email));
