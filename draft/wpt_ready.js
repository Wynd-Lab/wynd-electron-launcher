const data = '2021-12-21 12:17:09 [HTTP Server] started on port 9963'


console.log(['[HTTP Server] started on port', '[HTTPS Server] started on port'].indexOf(data) >= 0)
console.log(data.indexOf('[HTTP Server] started on port') >= 0)
console.log(data.indexOf('[HTTPS Server] started on port') >= 0)
