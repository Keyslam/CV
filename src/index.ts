import PDFDocument from 'pdfkit';
import fs from 'fs';

type language = "nl" | "en";

const activeLanguage: language = "nl";

type localizedStringGlobal = {
	global: string,
}

type localizedStringLang = {
	en: string,
	nl: string,
}

type localizedString = localizedStringGlobal | localizedStringLang;

function getLocalizedStringContent(string: localizedString): string {
	if ((string as localizedStringGlobal).global != undefined)
		return (string as localizedStringGlobal).global

	const stringLang = string as localizedStringLang;

	if (activeLanguage == "nl") {
		return stringLang.nl;
	} else if (activeLanguage == "en") {
		return stringLang.en;
	}
}

const font = "Helvetica";
const fontBold = "Helvetica-Bold"

function divider(doc: PDFKit.PDFDocument) {
	doc.moveTo(doc.x, doc.y);
	doc.lineTo(doc.page.width - doc.page.margins.right, doc.y);
	doc.stroke();
}

function pageHeader(doc: PDFKit.PDFDocument) {
	doc.font(font);
	doc.fontSize(14);

	doc.text("Curriculum Vitae", {
		align: "left",
		continued: true,
	});
	
	doc.text("Justin van der Leij", {
		align: "right",
	});

	divider(doc);

	doc.moveDown(2);
}

function header(doc: PDFKit.PDFDocument, text: localizedString) {
	doc.fontSize(12);

	doc.moveTo(doc.x, doc.y);
	doc.rect(doc.x, doc.y, doc.page.width - (doc.page.margins.right + doc.page.margins.left), 20);
	doc.fillAndStroke("#D3D3D3");
	doc.fillColor("#000000");

	doc.font(fontBold)
	doc.translate(5, 5);
	doc.text(getLocalizedStringContent(text));
	doc.translate(-5, -5);
	doc.font(font);

	doc.moveDown();
}

type PersonaliaItem = {
	subject: localizedString,
	content: localizedString,
}

function personaliaItem(doc: PDFKit.PDFDocument, personaliaItem: PersonaliaItem): void {
	doc.fontSize(10);
	
	doc.font(fontBold);
	doc.text(getLocalizedStringContent(personaliaItem.subject));
	doc.font(font);

	doc.moveUp();
	
	doc.translate(125, 0);
	doc.text(getLocalizedStringContent(personaliaItem.content), doc.x, doc.y, {
		width: 150,
	});
	doc.translate(-125, 0);

	doc.moveDown(0.2);
}

function personalia(doc: PDFKit.PDFDocument, personaliaItems: Array<PersonaliaItem>) {
	header(doc, {
		nl: "Personalia",
		en: "Personal details"
	});

	const startY = doc.y;

	personaliaItems.forEach(item => {
		personaliaItem(doc, item);
	});

	const endY = doc.y;

	const size = endY - startY;
		
	doc.image("me.png", doc.page.width - doc.page.margins.right - size, startY, {
		width: size
	});

	doc.moveDown();
}

function profile(doc: PDFKit.PDFDocument, body: localizedString) {
	header(doc, {
		nl: "Profiel",
		en: "Profile",
	});

	doc.fontSize(10);
	doc.text(getLocalizedStringContent(body));

	doc.moveDown();
}

type EducationItem = {
	name: localizedString,
	date: localizedString,
	location: localizedString,
	extra?: localizedString,
}

function educationItem(doc: PDFKit.PDFDocument, educationItem: EducationItem) {
	doc.fontSize(10);

	doc.font(fontBold);
	doc.text(getLocalizedStringContent(educationItem.name), {
		width: 160,
	});
	doc.font(font);

	const lines = doc.heightOfString(getLocalizedStringContent(educationItem.name), {
		width: 160,
	});

	doc.moveUp(Math.floor(lines / 11));

	doc.translate(180, 0);
	doc.text(getLocalizedStringContent(educationItem.date), {
		width: 120,
	});
	doc.translate(-180, 0);

	doc.moveUp();

	doc.text(getLocalizedStringContent(educationItem.location), {
		align: "right",
	});

	if (educationItem.extra != undefined) {
		doc.text(getLocalizedStringContent(educationItem.extra), { 
			align: "right",
		})
	}

	doc.moveDown();
}

function educations(doc: PDFKit.PDFDocument, educationItems: Array<EducationItem>) {
	header(doc, {
		nl: "Opleidingen",
		en: "Educations",
	});

	educationItems.forEach(item => {
		educationItem(doc, item);
	})
}

type WorkExperienceItem = {
	name: localizedString,
	date: localizedString,
	location: localizedString,
}

function workExperienceItem(doc: PDFKit.PDFDocument, workExperienceItem: WorkExperienceItem) {
	doc.fontSize(10);

	doc.font(fontBold);
	doc.text(getLocalizedStringContent(workExperienceItem.name), {
		width: 160,
	});
	doc.font(font);

	const lines = Math.floor(doc.heightOfString(getLocalizedStringContent(workExperienceItem.name), {
		width: 150,
	}) / 11);

	doc.moveUp(lines);

	doc.translate(180, 0);
	doc.text(getLocalizedStringContent(workExperienceItem.date), {
		width: 120,
	});
	doc.translate(-180, 0);

	doc.moveUp();

	doc.text(getLocalizedStringContent(workExperienceItem.location), {
		align: "right",
	});

	doc.moveDown(lines - 1);

	doc.moveDown(0.2);
}

function workExperience(doc: PDFKit.PDFDocument, workExperienceItems: Array<WorkExperienceItem>) {
	header(doc, {
		nl: "Werkervaring",
		en: "Job experience",
	});

	workExperienceItems.forEach(item => {
		workExperienceItem(doc, item);
	});

	doc.moveDown();
}

type PassionItem = {
	content: localizedString,
}

function passionItem(doc: PDFKit.PDFDocument, passionItem: PassionItem) {
	doc.font(font);
	doc.fontSize(10);

	doc.text(getLocalizedStringContent(passionItem.content));

	doc.moveDown(0.2);
}

function passions(doc: PDFKit.PDFDocument, passionItems: Array<PassionItem>) {
	header(doc, {
		nl: "Passies en hobbies",
		en: "Passions en hobby's"
	});

	passionItems.forEach(item => {
		passionItem(doc, item);
	});
}

type SkillItem = {
	name: localizedString,
}

function skillItem(doc: PDFKit.PDFDocument, skillItem: SkillItem) {
	doc.fontSize(10);
	
	doc.text(getLocalizedStringContent(skillItem.name));

	doc.moveDown(0.2);
}

function skills(doc: PDFKit.PDFDocument, skillItems: Array<SkillItem>) {
	header(doc, {
		nl: "Vaardigheden & Kwaliteiten",
		en: "Skills & Qualities"
	});

	skillItems.forEach(item => {
		skillItem(doc, item);
	});
}


const doc = new PDFDocument();

doc.pipe(fs.createWriteStream("output.pdf"));

pageHeader(doc);

personalia(doc, [
	{subject: {nl: "Naam", en: "Name"}, content: {global: "Justin van der Leij"}},
	{subject: {nl: "Adres", en: "Address"}, content: {global: "Lieuwenburg 45, Leeuwarden"}},
	{subject: {nl: "Telefoonnummer", en: "Phone number"}, content: {global: "+31-611032664"}},
	{subject: {nl: "E-mailadres", en: "E-mailaddress"}, content: {global: "justinvanderleij@gmail.com"}},
	{subject: {nl: "Geboortedatum", en: "Date of birth"}, content: {global: "11-08-1998"}},
	{subject: {nl: "Geboorteplaats", en: "Place of birth"}, content: {global: "Dongeradeel"}},
	{subject: {nl: "Geslacht", en: "Gender"}, content: {nl: "Man", en: "Male"}},
	{subject: {nl: "Nationaliteit", en: "Nationality"}, content: {nl: "Nederlandse", en: "Dutch"}},
	{subject: {nl: "Burgelijke staat", en: "Marital status"}, content: {nl: "Ongehuwd", en: "Unmarried"}},
])

profile(doc, {nl: `Ik ben een gedreven en enthousiaste software ontwikkelaar met een passie voor game development.
Geef mij een lastig probleem en ik zal met plezier uitpuzzelen hoe ik het kan oplossen.
Ik sta altijd open om nieuwe dingen te leren en ben daarom dus altijd op zoek naar een nieuwe uitdaging.
`, en: `I am a motivated and enthusiastic software engineer with a passion for game development.
Give me a difficult problem and I will happily figure out a solution.
I'm always open to try new things and am always looking for a new challenge.`});

educations(doc, [
	{
		name: {global: "HBO-ICT"}, 
		date: {nl: "Sept. 2019 - Heden", en: "Sept. 2019 - Now"}, 
		location: {global: "NHL Stenden Hogeschool, Leeuwarden"}, 
		extra: {nl: "Propedeuse behaald", en: "Propaedeutic diploma achieved"},
	},

	{
		name: {nl: "MBO-4 Applicatie Ontwikkeling", en: "MBO-4 Application Development"}, 
		date: {global: "Sept. 2014 - 2019"}, 
		location: {global: "Friesland College, Leeuwarden"}, 
		extra: {nl: "Diploma behaald", en: "Diploma achieved"},
	},

	{
		name: {global: "VMBO-TL"}, 
		date: {global: "Sept. 2010 - 2014"}, 
		location: {global: "Dr. J. de Graafschool, Groningen"}, 
		extra: {nl: "Diploma behaald", en: "Diploma achieved"},
	},
])

workExperience(doc, [
	{
		name: {nl: "Student-assistent / Docent Game Development", en: "Student-assistent / Teacher Game Development"}, 
		date: {nl: "Feb. 2022 - Heden", en: "Feb. 2022 - Now"}, 
		location: {global: "MBO Friese Poort, Leeuwarden"},
	},

	{
		name: {nl: "Stagair Software Engineer", en: "Intern Software Engineer"}, 
		date: {nl: "Sep. 2021 - Jan. 2022", en: "Sep. 2021 - Jan. 2022"}, 
		location: {global: "ISA-Lab, Leeuwarden"},
	},

	{
		name: {nl: "Student-assistent", en: "Student-assistent"}, 
		date: {nl: "Nov. 2020 - Mrt. 2021", en: "Nov. 2020 - Mar. 2021"}, 
		location: {global: "NHL Stenden, Leeuwarden"},
	},

	{
		name: {nl:"Begeleider Tech workshops", en: "Host Tech workshops"}, 
		date: {global:"Jun. 2020 - Nov. 2020"}, 
		location: {global:"BNFRL, Friesland"},
	},

	{
		name: {nl: "Full stack Web Developer", en: "Full stack Web Developer"}, 
		date: {global: "Feb. 2020 - Dec. 2020"}, 
		location: {global: "FVB, Utrecht"},
	},

	{
		name: {nl: "Deeltijd docent Web Development", en: "Parttime teacher Web Development"}, 
		date: {nl: "Okt. 2019 - Nov. 2019", en: "Oct. 2019 - Nov. 2019"}, 
		location: {global: "NHL Stenden, Leeuwarden"},
	},

	{
		name: {nl: "Student-assistent C#", en: "Student-assistent C#"}, 
		date: {global: "Sept. 2019 - Feb. 2020"}, 
		location: {global: "NHL Stenden, Leeuwarden"},
	},

	{
		name: {nl: "Stagiair Game Developer", en: "Intern Game Developer"}, 
		date: {global: "Sept. 2018 - Feb. 2019"}, 
		location: {global: "Grendel Games, Leeuwarden"},
	},

	{
		name: {nl: "Vuilnisman", en: "Garbage man"}, 
		date: {global: "Aug. 2016 - Dec. 2016"}, 
		location: {global: "Omrin, Leeuwarden"},
	},

	{
		name: {nl: "AGF Medewerker", en: "Fresh produce employee"}, 
		date: {nl: "Mrt. 2015 - Sept. 2015", en: "Mar. 2015 - Sept. 2015"}, 
		location: {global: "Jumbo, Leeuwarden"},
	},

	{
		name: {nl: "Stagiair Front-end Web Development", en: "Intern Front-end Web Development"}, 
		date: {nl: "Jan. 2015 - Mei 2015", en: "Jan. 2015 - May 2015"}, 
		location: {global: "FCSprint, Leeuwarden"},
	},
])

doc.addPage();
pageHeader(doc);

skills(doc, [
	{name: {nl: "Nederlands", en: "Dutch"}},
	{name: {nl: "Engels", en: "English"}},
	{name: {nl: "Programmeren", en: "Programming"}},
	{name: {nl: "Resultaatgerichtheid", en: "Results-oriented"}},
	{name: {nl: "Innovatief", en: "Innovative"}}
]);

passions(doc, [
	{content: {nl: "Katten", en: "Cats"}},
	{content: {nl: "Piano spelen", en: "Playing the piano"}},
	{content: {nl: "Knutselen met electronica", en: "Playing around with electronics"}},
]);

doc.end();