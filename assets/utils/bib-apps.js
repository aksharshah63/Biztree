export default (apps) => {
	return [
		{ img: "layers-solid", color: "primary", text: apps.templates, href: process.env.AppTemplate },
		{ img: "cloud-data-network-solid", color: "success", text: apps.files, href : process.env.AppDrive },
		{ img: "editor", color: "primary-sub1", text: apps.editor, href : process.env.AppEditor },
		{ img: "table", color: "primary", text: apps.sheets, href : process.env.AppSheets},
		{ img: "chat", color: "purple", text: apps.chat, href: process.env.AppChat },
		{ img: "signature", color: "orange", text: apps.sign, href : process.env.AppSign },
		{ img: "meetings", color: "warning", text: apps.connect, href : process.env.AppVideo},
		{ img: "projects", color: "primary", text: apps.project, href : process.env.AppProject },
	]
}
