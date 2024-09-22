// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc'

// https://astro.build/config
export default defineConfig({
	site: 'https://tomato6966.github.io/lavalink-client/',
	base: '/',
	integrations: [
		starlight({
			title: 'Lavalink Client',
			social: {
				github: 'https://github.com/Tomato6966/lavalink-client',
				//discord: 'https://discord.gg/',
			},
			editLink: {
				baseUrl: 'https://github.com/Tomato6966/lavalink-client/tree/main',
			},
			plugins: [
				// Generate the documentation.
				starlightTypeDoc({
					entryPoints: ['../src/index.ts'],
					tsconfig: '../tsconfig.json',
					typeDoc: {
						useCodeBlocks: true,
						parametersFormat: 'table',
						propertiesFormat: 'table',
						enumMembersFormat: 'table',
						typeDeclarationFormat: 'table',
						indexFormat: 'table',
						expandParameters: true,
						name: 'Lavalink Client',
					},
					pagination: true,
				}),
			],
			sidebar: [
				{
					label: 'Getting Started',
					collapsed: true,
					items: [
						{
							label: 'installation',
							link: '/home/installation',
						},
						{
							label: 'Features',
							link: '/home/features',
						},
						{
							label: 'Example Guide',
							link: '/home/example',
						},
						{
							label: 'Sample Configuration',
							link: '/home/configuration',
						}
					],
				},
				{
					label: 'Extra',
					collapsed: true,
					items: [
						{
							label: 'Manager Events',
							link: '/extra/manager-events',
						},
						{
							label: 'Node Events',
							link: '/extra/node-events',
						},
						{
							label: 'Resuming',
							link: '/extra/resuming',
						}
					]
				},
				typeDocSidebarGroup,
				{
					label: 'GitHub',
					link: 'https://github.com/Tomato6966/lavalink-client',
				},
				{
					label: 'NPM',
					link: 'https://npmjs.com/lavalink-client',
				},
				{
					label: 'Example Bot',
					link: 'https://github.com/Tomato6966/lavalink-client/tree/main/testBot',
				},
			],
		}),
	],
});
