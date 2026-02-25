import "dotenv/config";
import { connectMongo } from "../db/mongo";
import { Customer } from "../models/Customer";
import { CustomerSegment } from "../models/CustomerSegment";
import { Campaign } from "../models/Campaign";
import { LandingPage } from "../models/LandingPage";

function inDays(d: number) {
    return new Date(Date.now() + d * 24 * 60 * 60 * 1000);
}
function computeStatus(schedule?: { startAt?: Date; endAt?: Date }) {
    if (!schedule?.startAt || !schedule?.endAt) return "draft";
    const now = Date.now();
    const s = schedule.startAt.getTime();
    const e = schedule.endAt.getTime();
    if (s > now) return "scheduled";
    if (e < now) return "finished";
    return "active";
}
const uniq = <T>(xs: T[]) => Array.from(new Set(xs));

async function run() {
    await connectMongo();
    // Seed data mirrors the story the demo app tells about the hotel

    // --- Customers -----------------------------------------------------------
    const customers = [
        { firstName: "Anna", lastName: "Meier", age: 29, interests: ["Spa", "Yoga", "Wellness"], address: { street: "Pilatusstrasse 10", zip: "6003", city: "Luzern", country: "CH" } },
        { firstName: "Luca", lastName: "Müller", age: 34, interests: ["Hiking", "Mountain", "Photography"], address: { street: "Bahnhofstrasse 1", zip: "8001", city: "Zürich", country: "CH" } },
        { firstName: "Sofia", lastName: "Keller", age: 41, interests: ["Family", "Spa", "Brunch"], address: { street: "Marktgasse 7", zip: "3007", city: "Bern", country: "CH" } },
        { firstName: "Noah", lastName: "Schneider", age: 37, interests: ["Business", "Golf", "Fine Dining"], address: { street: "Aeschenplatz 3", zip: "4051", city: "Basel", country: "CH" } },
        { firstName: "Mia", lastName: "Weber", age: 26, interests: ["City Breaks", "Art", "Spa"], address: { street: "Rue du Port 5", zip: "1003", city: "Lausanne", country: "CH" } },
        { firstName: "Leon", lastName: "Fischer", age: 45, interests: ["Wine", "Gourmet", "Hiking"], address: { street: "St. Leonhard-Strasse 12", zip: "9000", city: "St. Gallen", country: "CH" } },
        { firstName: "Lina", lastName: "Hofmann", age: 31, interests: ["Yoga", "Wellness", "Spa"], address: { street: "Poststrasse 8", zip: "6300", city: "Zug", country: "CH" } },
        { firstName: "Elias", lastName: "Baumann", age: 52, interests: ["Golf", "Business", "Conference"], address: { street: "Limmatquai 20", zip: "8001", city: "Zürich", country: "CH" } },
        { firstName: "Nora", lastName: "Graf", age: 38, interests: ["Family", "Hiking", "Lake"], address: { street: "Seebrücke 2", zip: "6003", city: "Luzern", country: "CH" } },
        { firstName: "Tim", lastName: "Berger", age: 28, interests: ["Adventure", "Diving", "Fitness"], address: { street: "Via Nassa 4", zip: "6900", city: "Lugano", country: "CH" } },
        { firstName: "Lara", lastName: "Brunner", age: 33, interests: ["Spa", "Fine Dining", "Wine"], address: { street: "Weite Gasse 11", zip: "5400", city: "Baden", country: "CH" } },
        { firstName: "Jonas", lastName: "Frei", age: 47, interests: ["Business", "Conference", "Golf"], address: { street: "Paradeplatz 1", zip: "8001", city: "Zürich", country: "CH" } },
        { firstName: "Emma", lastName: "Schmid", age: 22, interests: ["Budget", "City Breaks", "Art"], address: { street: "Technikumstrasse 9", zip: "8400", city: "Winterthur", country: "CH" } },
        { firstName: "David", lastName: "Roth", age: 36, interests: ["Spa", "Wellness", "Hiking"], address: { street: "Obere Gasse 6", zip: "7000", city: "Chur", country: "CH" } },
        { firstName: "Nina", lastName: "Keller", age: 44, interests: ["Family", "Spa", "Gourmet"], address: { street: "Zentralstrasse 14", zip: "2502", city: "Biel/Bienne", country: "CH" } },
        { firstName: "Marco", lastName: "Kuhn", age: 39, interests: ["Cycling", "Hiking", "Lake"], address: { street: "Seestrasse 21", zip: "3600", city: "Thun", country: "CH" } },
        { firstName: "Sarah", lastName: "Vogel", age: 27, interests: ["Yoga", "Wellness", "Photography"], address: { street: "Rheingasse 2", zip: "4051", city: "Basel", country: "CH" } },
        { firstName: "Fabio", lastName: "Steiner", age: 50, interests: ["Business", "Golf", "Wine"], address: { street: "Bundesplatz 4", zip: "6300", city: "Zug", country: "CH" } },
        { firstName: "Laura", lastName: "Huber", age: 35, interests: ["Spa", "Romantic", "Lake"], address: { street: "Grand Rue 3", zip: "1820", city: "Montreux", country: "CH" } },
        { firstName: "Paul", lastName: "Marti", age: 42, interests: ["Hiking", "Family", "Wellness"], address: { street: "Bahnhofstrasse 5", zip: "5000", city: "Aarau", country: "CH" } },
        { firstName: "Clara", lastName: "Imhof", age: 30, interests: ["Museum", "Art", "City Breaks"], address: { street: "Höheweg 5", zip: "3800", city: "Interlaken", country: "CH" } },
        { firstName: "Tobias", lastName: "Gerber", age: 33, interests: ["Skiing", "Mountain", "Adventure"], address: { street: "Bahnhofstrasse 2", zip: "3920", city: "Zermatt", country: "CH" } },
        { firstName: "Marek", lastName: "Keller", age: 48, interests: ["Wine", "Gourmet", "Fine Dining"], address: { street: "Promenade 38", zip: "7270", city: "Davos", country: "CH" } },
        { firstName: "Helena", lastName: "Wyss", age: 29, interests: ["Photography", "Hiking", "Lake"], address: { street: "Via Serlas 12", zip: "7500", city: "St. Moritz", country: "CH" } },
        { firstName: "Pascal", lastName: "Arnold", age: 51, interests: ["Business", "Conference", "Golf"], address: { street: "Fronwagplatz 1", zip: "8200", city: "Schaffhausen", country: "CH" } },
        { firstName: "Aline", lastName: "Dupont", age: 27, interests: ["Wellness", "Spa", "Yoga"], address: { street: "Rue de l'Hôpital", zip: "2000", city: "Neuchâtel", country: "CH" } },
        { firstName: "Gael", lastName: "Favre", age: 46, interests: ["Cycling", "Lake", "Sailing"], address: { street: "Rue du Rhône 15", zip: "1950", city: "Sion", country: "CH" } },
        { firstName: "Mara", lastName: "Schwarz", age: 32, interests: ["Art", "Theater", "City Breaks"], address: { street: "Rue de Lausanne 7", zip: "1700", city: "Fribourg", country: "CH" } },
        { firstName: "Reto", lastName: "Bucher", age: 41, interests: ["Golf", "Wine", "Business"], address: { street: "Barfüsserplatz 6", zip: "4051", city: "Basel", country: "CH" } },
        { firstName: "Yann", lastName: "Lambert", age: 36, interests: ["Romantic", "Spa", "Wellness"], address: { street: "Rue Centrale 3", zip: "2300", city: "La Chaux-de-Fonds", country: "CH" } },
        { firstName: "Nadia", lastName: "Suter", age: 24, interests: ["Budget", "Adventure", "Fitness"], address: { street: "Hauptstrasse 10", zip: "7000", city: "Chur", country: "CH" } },
        { firstName: "Oliver", lastName: "Ziegler", age: 55, interests: ["Conference", "Business", "Golf"], address: { street: "Bahnhofstrasse 9", zip: "5000", city: "Aarau", country: "CH" } },
        { firstName: "Julia", lastName: "Aeschlimann", age: 40, interests: ["Spa", "Yoga", "Romantic"], address: { street: "Seequai 4", zip: "8640", city: "Rapperswil", country: "CH" } },
        { firstName: "Denis", lastName: "Schmidlin", age: 39, interests: ["Cycling", "Lake", "Hiking"], address: { street: "Aarestrasse 12", zip: "4500", city: "Solothurn", country: "CH" } },
        { firstName: "Isabel", lastName: "Martinez", age: 34, interests: ["City Breaks", "Museum", "Art"], address: { street: "Avenue Nestlé 6", zip: "1800", city: "Vevey", country: "CH" } },
        { firstName: "Quentin", lastName: "Morel", age: 31, interests: ["Wine", "Gourmet", "Fine Dining"], address: { street: "Rue de la Plaine", zip: "1400", city: "Yverdon", country: "CH" } },
        { firstName: "Peter", lastName: "Kaufmann", age: 46, interests: ["Skiing", "Mountain", "Wellness"], address: { street: "Dorfstrasse 2", zip: "3792", city: "Saanen", country: "CH" } },
        { firstName: "Sabine", lastName: "Ackermann", age: 28, interests: ["Photography", "Art", "City Breaks"], address: { street: "Altstadt 3", zip: "6430", city: "Schwyz", country: "CH" } },
        { firstName: "Franz", lastName: "Haller", age: 53, interests: ["Wine", "Gourmet", "Business"], address: { street: "Hauptgasse 8", zip: "9050", city: "Appenzell", country: "CH" } },
        { firstName: "Greta", lastName: "Bernet", age: 26, interests: ["Adventure", "Diving", "Fitness"], address: { street: "Bodenstrasse 1", zip: "8750", city: "Glarus", country: "CH" } },
        { firstName: "Urs", lastName: "Feldmann", age: 45, interests: ["Conference", "Business", "Golf"], address: { street: "Platz 2", zip: "8500", city: "Frauenfeld", country: "CH" } },
        { firstName: "Sophie", lastName: "Rey", age: 33, interests: ["Romantic", "Spa", "Wine"], address: { street: "Avenue des Alpes", zip: "1820", city: "Montreux", country: "CH" } },
        { firstName: "Kai", lastName: "Lutz", age: 29, interests: ["Cycling", "Lake", "Sailing"], address: { street: "Uferweg 2", zip: "6353", city: "Weggis", country: "CH" } },
        { firstName: "Milan", lastName: "Hofer", age: 37, interests: ["Family", "Hiking", "Lake"], address: { street: "Mattenstrasse 7", zip: "3800", city: "Interlaken", country: "CH" } },
        { firstName: "Jeanne", lastName: "Borel", age: 42, interests: ["Theater", "Art", "City Breaks"], address: { street: "Rue du Théâtre 1", zip: "1204", city: "Genève", country: "CH" } },
        { firstName: "Tom", lastName: "Baertschi", age: 35, interests: ["Skiing", "Snowboard", "Mountain"], address: { street: "Talstrasse 10", zip: "7260", city: "Davos Dorf", country: "CH" } },
        { firstName: "Elena", lastName: "Moretti", age: 31, interests: ["Shopping", "Luxury", "Fashion"], address: { street: "Via Nassa 22", zip: "6900", city: "Lugano", country: "CH" } },
        { firstName: "Thomas", lastName: "Rieder", age: 43, interests: ["Photography", "Nature", "Hiking"], address: { street: "Dorfstrasse 5", zip: "3818", city: "Grindelwald", country: "CH" } },
        { firstName: "Sophie", lastName: "Dubois", age: 29, interests: ["Music", "Concert", "Culture"], address: { street: "Rue de la Cité 4", zip: "1204", city: "Genève", country: "CH" } },
        { firstName: "Michael", lastName: "Wenger", age: 58, interests: ["History", "Architecture", "Museum"], address: { street: "Kramgasse 12", zip: "3011", city: "Bern", country: "CH" } },
    ];

    const reset = process.argv.includes("--reset");
    if (reset) {
        await Promise.all([
            Customer.deleteMany({}),
            CustomerSegment.deleteMany({}),
            Campaign.deleteMany({}),
            LandingPage.deleteMany({}),
        ]);
        console.log("Cleared Customers, CustomerSegments, Campaigns, LandingPages.");
    }

    const existingCustomers = await Customer.countDocuments();
    if (existingCustomers === 0) {
        await Customer.insertMany(customers);
        console.log(`Inserted ${customers.length} customers.`);
    } else {
        console.log(`Skip customers: ${existingCustomers} already present.`);
    }

    // Reload customers with _ids to build segments
    const allCustomers = await Customer.find().lean();
    const idBy = (fn: (c: any) => boolean) => allCustomers.filter(fn).map((c) => c._id);

    // helper predicates
    const has = (k: string) => (c: any) => Array.isArray(c.interests) && c.interests.includes(k);
    const inCity = (city: string) => (c: any) => c.address?.city === city;
    const inCities = (cities: string[]) => (c: any) => c.address && cities.includes(c.address.city);

    // --- Customer Segments ---------------------------------------------------
    const segmentsToCreate = [
        { title: "Wellness & Erholung", customers: uniq([...idBy(has("Spa")), ...idBy(has("Wellness")), ...idBy(has("Yoga"))]).slice(0, 18) },
        { title: "Geschäftsreisende & Golf", customers: uniq([...idBy(has("Business")), ...idBy(has("Conference")), ...idBy(has("Golf"))]).slice(0, 18) },
        { title: "Familien & Wandern", customers: uniq([...idBy(has("Lake")), ...idBy(has("Hiking")), ...idBy(has("Family"))]).slice(0, 18) },
        { title: "Städtereisen & Kultur", customers: uniq([...idBy(has("City Breaks")), ...idBy(has("Art")), ...idBy(inCities(["Zürich", "Lausanne", "Genève"]))]).slice(0, 18) },
        { title: "Wein & Gourmet", customers: uniq([...idBy(has("Wine")), ...idBy(has("Gourmet")), ...idBy(has("Fine Dining"))]).slice(0, 16) },
        { title: "Sport & Abenteuer", customers: uniq([...idBy(has("Adventure")), ...idBy(has("Fitness")), ...idBy(has("Mountain"))]).slice(0, 16) },
        { title: "Paare & Romantik", customers: uniq([...idBy(has("Romantic")), ...idBy(has("Spa")), ...idBy(inCities(["Montreux", "Vevey"]))]).slice(0, 16) },
        { title: "Radfahren & See", customers: uniq([...idBy(has("Cycling")), ...idBy(has("Lake"))]).slice(0, 16) },
        { title: "Konferenz Zürich", customers: uniq([...idBy(inCity("Zürich")), ...idBy(has("Conference")), ...idBy(has("Business"))]).slice(0, 16) },
        { title: "Wintersport", customers: uniq([...idBy(has("Skiing")), ...idBy(has("Snowboard")), ...idBy(has("Mountain"))]).slice(0, 16) },
        { title: "Luxus & Shopping", customers: uniq([...idBy(has("Luxury")), ...idBy(has("Shopping")), ...idBy(has("Fashion"))]).slice(0, 16) },
        { title: "Natur & Fotografie", customers: uniq([...idBy(has("Nature")), ...idBy(has("Photography")), ...idBy(has("Hiking"))]).slice(0, 16) },
        { title: "Musik & Konzerte", customers: uniq([...idBy(has("Music")), ...idBy(has("Concert")), ...idBy(has("Culture"))]).slice(0, 16) },
        { title: "Historische Städte", customers: uniq([...idBy(has("History")), ...idBy(has("Architecture")), ...idBy(has("Museum"))]).slice(0, 16) },
    ];

    let segCount = await CustomerSegment.countDocuments();
    if (segCount === 0) {
        await CustomerSegment.insertMany(segmentsToCreate);
        segCount = await CustomerSegment.countDocuments();
        console.log(`Inserted ${segCount} customer segments.`);
    } else {
        console.log(`Skip segments: ${segCount} already present.`);
    }

    // --- Landing Pages (upsert to ensure presence) ---------------------------
    const landingPagesToCreate = [
        { title: "Herbst-Wellness", url: "https://hotel.example.com/herbst-wellness", status: "published" as const, bodyHtml: "<h1>Entspannung pur</h1><p>Exklusive Spa-Angebote diesen Herbst.</p>" },
        { title: "Konferenz-Angebot", url: "https://hotel.example.com/konferenz", status: "published" as const, bodyHtml: "<h1>Tagen & Erfolg haben</h1><p>Moderne Räume, beste Aussicht.</p>" },
        { title: "Familienwochenende am See", url: "https://hotel.example.com/familie-see", status: "published" as const, bodyHtml: "<h1>Zeit für die Familie</h1><p>Kinderfreundlich und direkt am See.</p>" },
        { title: "Städtereisen & Kultur", url: "https://hotel.example.com/kultur-stadt", status: "published" as const, bodyHtml: "<h1>Kunst & Komfort</h1><p>Entdecken Sie die Stadt.</p>" },
        { title: "Winter-Wellness-Woche", url: "https://hotel.example.com/winter-wellness", status: "draft" as const, bodyHtml: "<h1>Aufwärmen</h1><p>Sauna, Massagen und Thermalbad.</p>" },
        { title: "Frühlingstour Radfahren", url: "https://hotel.example.com/fruehling-rad", status: "published" as const, bodyHtml: "<h1>Radeln & Relaxen</h1><p>Geführte Touren und Picknicks am See.</p>" },
        { title: "Gourmet-Woche", url: "https://hotel.example.com/gourmet-wein", status: "published" as const, bodyHtml: "<h1>Wein & Genuss</h1><p>Sommelier-Begleitung und Degustationsmenü.</p>" },
        { title: "Valentins-Special", url: "https://hotel.example.com/valentin", status: "published" as const, bodyHtml: "<h1>Zeit zu zweit</h1><p>Romantisches Dinner und Spa-Zugang.</p>" },
        { title: "Sommer-Bergtouren", url: "https://hotel.example.com/sommer-abenteuer", status: "draft" as const, bodyHtml: "<h1>Abenteuer ruft</h1><p>Klettern und Wandern in den Alpen.</p>" },
        { title: "Zürich Konferenz Early Bird", url: "https://hotel.example.com/zrh-konferenz", status: "published" as const, bodyHtml: "<h1>Frühbucherrabatt</h1><p>Sichern Sie sich 15% Rabatt.</p>" },
        { title: "Montreux Jazz Festival Paket", url: "https://hotel.example.com/montreux-jazz", status: "published" as const, bodyHtml: "<h1>Jazz & See</h1><p>Zimmer mit Seeblick.</p>" },
        { title: "Yoga-Retreat am See", url: "https://hotel.example.com/yoga-retreat", status: "published" as const, bodyHtml: "<h1>Finde deinen Flow</h1><p>Yoga bei Sonnenaufgang.</p>" },
        { title: "Wintersport-Auszeit", url: "https://hotel.example.com/wintersport", status: "published" as const, bodyHtml: "<h1>Ab auf die Piste</h1><p>Skipass inklusive.</p>" },
        { title: "Exklusives Shopping-Wochenende", url: "https://hotel.example.com/shopping-luxury", status: "published" as const, bodyHtml: "<h1>Luxus pur</h1><p>Privates Shopping-Erlebnis und Champagner.</p>" },
        { title: "Fotokurs in den Bergen", url: "https://hotel.example.com/foto-kurs", status: "published" as const, bodyHtml: "<h1>Das perfekte Bild</h1><p>Lernen Sie von Profis in atemberaubender Kulisse.</p>" },
        { title: "Klassik-Konzert am See", url: "https://hotel.example.com/klassik-konzert", status: "published" as const, bodyHtml: "<h1>Klingende Ufer</h1><p>Ein unvergesslicher Abend mit klassischer Musik.</p>" },
        { title: "Historische Stadtführung", url: "https://hotel.example.com/historie-stadt", status: "published" as const, bodyHtml: "<h1>Zeitreise</h1><p>Entdecken Sie die Geheimnisse der Altstadt.</p>" },
    ];

    for (const lp of landingPagesToCreate) {
        await LandingPage.updateOne({ url: lp.url }, { $setOnInsert: lp }, { upsert: true });
    }
    const landingPages = await LandingPage.find().lean();
    const lpId = (title: string) => landingPages.find((x) => x.title === title)?._id;

    // --- Campaigns (start/end; status derived; link landingPage) -------------
    const segments = await CustomerSegment.find().lean();
    const segId = (title: string) => segments.find((s) => s.title === title)?._id;

    const campaignsToCreate = [
        {
            name: "Herbst-Wellness",
            segmentCriteria: { season: "autumn", tags: ["spa", "wellness"] },
            segments: [segId("Wellness & Erholung")].filter(Boolean) as any[],
            landingPage: lpId("Herbst-Wellness"),
            schedule: { startAt: inDays(-4), endAt: inDays(3) }, // active
            metrics: { sent: 500, opened: 200, clicked: 50 },
        },
        {
            name: "Konferenz-Angebot",
            segmentCriteria: { audience: "business", tags: ["conference", "golf"] },
            segments: [segId("Geschäftsreisende & Golf"), segId("Konferenz Zürich")].filter(Boolean) as any[],
            landingPage: lpId("Konferenz-Angebot"),
            schedule: { startAt: inDays(7), endAt: inDays(14) }, // scheduled
            metrics: { sent: 0, opened: 0, clicked: 0 },
        },
        {
            name: "Familienwochenende am See",
            segmentCriteria: { weekend: true, tags: ["family", "lake", "hiking"] },
            segments: [segId("Familien & Wandern"), segId("Radfahren & See")].filter(Boolean) as any[],
            landingPage: lpId("Familienwochenende am See"),
            schedule: { startAt: inDays(-10), endAt: inDays(-3) }, // finished
            metrics: { sent: 1200, opened: 820, clicked: 350 }, // High engagement
        },
        {
            name: "Städtereisen & Kultur",
            segmentCriteria: { theme: "city", tags: ["city breaks", "art"] },
            segments: [segId("Städtereisen & Kultur")].filter(Boolean) as any[],
            landingPage: lpId("Städtereisen & Kultur"),
            schedule: { startAt: inDays(-2), endAt: inDays(5) }, // active
            metrics: { sent: 800, opened: 450, clicked: 120 },
        },
        {
            name: "Winter-Wellness-Woche",
            segmentCriteria: { season: "winter", tags: ["wellness", "spa"] },
            segments: [segId("Wellness & Erholung"), segId("Wintersport")].filter(Boolean) as any[],
            landingPage: lpId("Winter-Wellness-Woche"),
            schedule: { startAt: inDays(30), endAt: inDays(37) }, // scheduled
            metrics: { sent: 0, opened: 0, clicked: 0 },
        },
        {
            name: "Frühlingstour Radfahren",
            segmentCriteria: { season: "spring", tags: ["cycling", "lake"] },
            segments: [segId("Radfahren & See")].filter(Boolean) as any[],
            landingPage: lpId("Frühlingstour Radfahren"),
            schedule: { startAt: inDays(-5), endAt: inDays(2) }, // active
            metrics: { sent: 0, opened: 0, clicked: 0 },
        },
        {
            name: "Gourmet-Woche",
            segmentCriteria: { theme: "culinary", tags: ["wine", "gourmet", "fine dining"] },
            segments: [segId("Wein & Gourmet")].filter(Boolean) as any[],
            landingPage: lpId("Gourmet-Woche"),
            schedule: { startAt: inDays(12), endAt: inDays(15) }, // scheduled
            metrics: { sent: 0, opened: 0, clicked: 0 },
        },
        {
            name: "Valentins-Special",
            segmentCriteria: { theme: "romance", tags: ["romantic", "spa"] },
            segments: [segId("Paare & Romantik")].filter(Boolean) as any[],
            landingPage: lpId("Valentins-Special"),
            schedule: { startAt: inDays(-40), endAt: inDays(-35) }, // finished
            metrics: { sent: 1500, opened: 520, clicked: 130 },
        },
        {
            name: "Sommer-Bergtouren",
            segmentCriteria: { season: "summer", tags: ["adventure", "fitness", "mountain"] },
            segments: [segId("Sport & Abenteuer")].filter(Boolean) as any[],
            landingPage: lpId("Sommer-Bergtouren"),
            schedule: { startAt: inDays(60), endAt: inDays(70) }, // scheduled
            metrics: { sent: 0, opened: 0, clicked: 0 },
        },
        {
            name: "Zürich Konferenz Early Bird",
            segmentCriteria: { audience: "business", city: "Zürich", tags: ["conference"] },
            segments: [segId("Konferenz Zürich")].filter(Boolean) as any[],
            landingPage: lpId("Zürich Konferenz Early Bird"),
            schedule: { startAt: inDays(-1), endAt: inDays(8) }, // active
            metrics: { sent: 0, opened: 0, clicked: 0 },
        },
        {
            name: "Montreux Jazz Festival Paket",
            segmentCriteria: { theme: "festival", tags: ["jazz", "city breaks"] },
            segments: [segId("Städtereisen & Kultur"), segId("Paare & Romantik")].filter(Boolean) as any[],
            landingPage: lpId("Montreux Jazz Festival Paket"),
            schedule: { startAt: inDays(90), endAt: inDays(96) }, // scheduled
            metrics: { sent: 0, opened: 0, clicked: 0 },
        },
        {
            name: "Yoga-Retreat am See",
            segmentCriteria: { theme: "wellness", tags: ["yoga", "spa", "lake"] },
            segments: [segId("Wellness & Erholung"), segId("Radfahren & See")].filter(Boolean) as any[],
            landingPage: lpId("Yoga-Retreat am See"),
            schedule: { startAt: inDays(4), endAt: inDays(6) }, // scheduled
            metrics: { sent: 0, opened: 0, clicked: 0 },
        },
        {
            name: "Wintersport-Auszeit",
            segmentCriteria: { season: "winter", tags: ["skiing", "snowboard", "mountain"] },
            segments: [segId("Wintersport")].filter(Boolean) as any[],
            landingPage: lpId("Wintersport-Auszeit"),
            schedule: { startAt: inDays(-20), endAt: inDays(-12) }, // finished
            metrics: { sent: 1900, opened: 610, clicked: 180 },
        },
        {
            name: "Exklusives Shopping-Wochenende",
            segmentCriteria: { theme: "luxury", tags: ["shopping", "fashion"] },
            segments: [segId("Luxus & Shopping")].filter(Boolean) as any[],
            landingPage: lpId("Exklusives Shopping-Wochenende"),
            schedule: { startAt: inDays(10), endAt: inDays(15) }, // scheduled
            metrics: { sent: 0, opened: 0, clicked: 0 },
        },
        {
            name: "Fotokurs in den Bergen",
            segmentCriteria: { theme: "hobby", tags: ["photography", "nature"] },
            segments: [segId("Natur & Fotografie"), segId("Familien & Wandern")].filter(Boolean) as any[],
            landingPage: lpId("Fotokurs in den Bergen"),
            schedule: { startAt: inDays(20), endAt: inDays(25) }, // scheduled
            metrics: { sent: 0, opened: 0, clicked: 0 },
        },
        {
            name: "Klassik-Konzert am See",
            segmentCriteria: { theme: "culture", tags: ["music", "concert"] },
            segments: [segId("Musik & Konzerte"), segId("Städtereisen & Kultur")].filter(Boolean) as any[],
            landingPage: lpId("Klassik-Konzert am See"),
            schedule: { startAt: inDays(5), endAt: inDays(8) }, // scheduled
            metrics: { sent: 0, opened: 0, clicked: 0 },
        },
        {
            name: "Historische Stadtführung",
            segmentCriteria: { theme: "history", tags: ["history", "culture"] },
            segments: [segId("Historische Städte"), segId("Städtereisen & Kultur")].filter(Boolean) as any[],
            landingPage: lpId("Historische Stadtführung"),
            schedule: { startAt: inDays(-2), endAt: inDays(10) }, // active
            metrics: { sent: 600, opened: 300, clicked: 50 },
        },
    ];

    const existingCampaigns = await Campaign.countDocuments();
    if (existingCampaigns === 0) {
        const toInsert = campaignsToCreate.map((c) => ({
            ...c,
            status: computeStatus(c.schedule),
        }));
        await Campaign.insertMany(toInsert);
        console.log(`Inserted ${toInsert.length} campaigns.`);
    } else {
        console.log(`Skip campaigns: ${existingCampaigns} already present.`);
    }

    // --- Final counts --------------------------------------------------------
    const [cCount, sCount, caCount, lpCount] = await Promise.all([
        Customer.countDocuments(),
        CustomerSegment.countDocuments(),
        Campaign.countDocuments(),
        LandingPage.countDocuments(),
    ]);

    console.log(`Customers: ${cCount} | Segments: ${sCount} | Campaigns: ${caCount} | LandingPages: ${lpCount}`);
    process.exit(0);
}

run().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
