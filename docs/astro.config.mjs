// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightTypeDoc, { typeDocSidebarGroup } from "starlight-typedoc"
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightTypeDoc, { typeDocSidebarGroup } from "starlight-typedoc"

// https://astro.build/config
export default defineConfig({
	site: "https://tomato6966.github.io/lavalink-client/",
	base: "/",
	site: "https://tomato6966.github.io/lavalink-client/",
	base: "/",
	integrations: [
		starlight({
			title: "Lavalink Client",
			title: "Lavalink Client",
			social: {
				github: "https://github.com/Tomato6966/lavalink-client",
                discord: "https://discord.gg/AsgD3gtPnb",
                email: "mailto:chrissy@mivator.com",
				github: "https://github.com/Tomato6966/lavalink-client",
                discord: "https://discord.gg/AsgD3gtPnb",
                email: "mailto:chrissy@mivator.com",
			},
			editLink: {
				baseUrl: "https://github.com/Tomato6966/lavalink-client/tree/main",
				baseUrl: "https://github.com/Tomato6966/lavalink-client/tree/main",
			},
			plugins: [
				// Generate the documentation.
				starlightTypeDoc({
					entryPoints: ["../src/structures/**/*.ts"],
					tsconfig: "../tsconfig.json",
					entryPoints: ["../src/structures/**/*.ts"],
					tsconfig: "../tsconfig.json",
					typeDoc: {
						useCodeBlocks: true,
						parametersFormat: "table",
						propertiesFormat: "table",
						enumMembersFormat: "table",
						typeDeclarationFormat: "table",
						indexFormat: "table",
						parametersFormat: "table",
						propertiesFormat: "table",
						enumMembersFormat: "table",
						typeDeclarationFormat: "table",
						indexFormat: "table",
						expandParameters: true,
						name: "Lavalink Client",
						name: "Lavalink Client",
					},
					pagination: true,
				}),
			],
			sidebar: [
				{
					label: "Getting Started",
					label: "Getting Started",
					collapsed: true,
					items: [
						{
							label: "installation",
							link: "/home/installation",
						},
						{
							label: "Setup Lavalink-Server",
							link: "/home/setup-lavalink",
						},
						{
							label: "Features",
							link: "/home/features",
						},
						{
							label: "Example Guides",
							link: "/home/example",
						},
						{
							label: "Sample Configuration",
							link: "/home/configuration",
						},
                        {
                            label: "Checkout Docs (Manager-Class)",
                            link: "/api/lavalinkmanager/classes/lavalinkmanager"
                        }
							label: "Sample Configuration",
							link: "/home/configuration",
						},
                        {
                            label: "Checkout Docs (Manager-Class)",
                            link: "/api/lavalinkmanager/classes/lavalinkmanager"
                        }
					],
				},
				{
					label: "Extra",
					label: "Extra",
					collapsed: true,
					items: [
						{
							label: "Manager Events",
							link: "/extra/manager-events",
							label: "Manager Events",
							link: "/extra/manager-events",
						},
						{
							label: "Node Events",
							link: "/extra/node-events",
							label: "Node Events",
							link: "/extra/node-events",
						},
						{
							label: "Resuming",
							link: "/extra/resuming",
						},
						{
							label: "Version-Update-Log",
							link: "/extra/version-log",
						}
					]
				},
				typeDocSidebarGroup,
				{
					label: "GitHub",
					link: "https://github.com/Tomato6966/lavalink-client",
					label: "GitHub",
					link: "https://github.com/Tomato6966/lavalink-client",
				},
				{
					label: "NPM",
					link: "https://npmjs.com/lavalink-client",
					label: "NPM",
					link: "https://npmjs.com/lavalink-client",
				},
				{
					label: "Example Bot",
					link: "https://github.com/Tomato6966/lavalink-client/tree/main/testBot",
					label: "Example Bot",
					link: "https://github.com/Tomato6966/lavalink-client/tree/main/testBot",
				},
                {
                    label: "Lavalink-Discord",
                    link: "https://discord.gg/lavalink-1082302532421943407"
                },
                {
                    label: "Lavalink-Web",
                    link: "https://lavalink.dev"
                }
                {
                    label: "Lavalink-Discord",
                    link: "https://discord.gg/lavalink-1082302532421943407"
                },
                {
                    label: "Lavalink-Web",
                    link: "https://lavalink.dev"
                }
			],
		}),
	],
});
