// /*
//         Build a <p> for messages using markdown
// 		https://github.com/markdown-it/markdown-it
// 	*/
// export function validateText(str)
// 	{
// 		var md = window.markdownit({
// 			highlight: function (str, lang) {
// 				if (lang && hljs.getLanguage(lang)) {
// 					try {
// 						return '<pre class="hljs"><code>' +
// 							hljs.highlight(lang, str, true).value +
// 							'</code></pre>';
// 					} catch (__) {}
// 				}
// 				return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
//             },
            
//             // THis is important 
//             // Allow link to be posted and then add 
// 			linkify: true,
// 		});
// 		var result = md.render(str);
// 		return result
// 	}