// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightTypeDoc, { typeDocSidebarGroup } from "starlight-typedoc"

// https://astro.build/config
export default defineConfig({
	site: "https://tomato6966.github.io",
	base: "lavalink-client",
	integrations: [
		starlight({
			title: "Lavalink Client",
			social: {
				github: "https://github.com/Tomato6966/lavalink-client",
                discord: "https://discord.gg/AsgD3gtPnb",
                email: "mailto:chrissy@mivator.com",
			},
			editLink: {
				baseUrl: "https://github.com/Tomato6966/lavalink-client/tree/main",
			},
			plugins: [
				// Generate the documentation.
				starlightTypeDoc({
					entryPoints: ["../src/structures/**/*.ts"],
					tsconfig: "../tsconfig.json",
					typeDoc: {
						useCodeBlocks: true,
						parametersFormat: "table",
						propertiesFormat: "table",
						enumMembersFormat: "table",
						typeDeclarationFormat: "table",
						indexFormat: "table",
						expandParameters: true,
						name: "Lavalink Client",
					},
					pagination: true,
				}),
			],
			sidebar: [
				{
					label: "Getting Started",
					collapsed: true,
					items: [
						{
							label: "installation",
							link: "/lavalink-client/home/installation",
						},
						{
							label: "Setup Lavalink-Server",
							link: "/lavalink-client/home/setup-lavalink",
						},
						{
							label: "Features",
							link: "/lavalink-client/home/features",
						},
						{
							label: "Example Guides",
							link: "/lavalink-client/home/example",
						},
						{
							label: "Sample Configuration",
							link: "/lavalink-client/home/configuration",
						},
                        {
                            label: "Checkout Docs (Manager-Class)",
                            link: "/lavalink-client/api/lavalinkmanager/classes/lavalinkmanager"
                        },
					],
				},
				{
					label: "Extra",
					collapsed: true,
					items: [
						{
							label: "Manager Events",
							link: "/lavalink-client/extra/manager-events",
						},
						{
							label: "Node Events",
							link: "/lavalink-client/extra/node-events",
						},
						{
							label: "Resuming",
							link: "/lavalink-client/extra/resuming",
						},
						{
							label: "Version-Update-Log",
							link: "/lavalink-client/extra/version-log",
						}
					]
				},
				typeDocSidebarGroup,
				{
					label: "GitHub",
					link: "https://github.com/Tomato6966/lavalink-client",
				},
				{
					label: "NPM",
					link: "https://npmjs.com/lavalink-client",
				},
				{
					label: "Example Bot",
					link: "https://github.com/Tomato6966/lavalink-client/tree/main/testBot",
				},
                {
                    label: "Official Lavalink-Discord",
                    link: "https://discord.gg/lavalink-1082302532421943407"
                },
                {
                    label: "Official Lavalink-Web",
                    link: "https://lavalink.dev"
                }
			],
		}),
	],
});
