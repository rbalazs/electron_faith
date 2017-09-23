const http = require('http');
const GoogleImages = require('google-images');

http.request({
    host: 'calapi.inadiutorium.cz',
    port: 80,
    path: '/api/v0/en/calendars/default/today',
    method: 'GET'
}, function (response) {
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
        let data = JSON.parse(chunk);
        const client = new GoogleImages('', '');

        $('h1.title').text(data['celebrations'][0].title);
        $('.date').text(data['date']);
        $('.rank').text(data['celebrations'][0].rank);
        $('.color').text(data['celebrations'][0].colour);
        $('.weight').text(data['celebrations'][0].rank_num);

        client.search(data['celebrations'][0].title)
            .then(images => {
                console.log(images);
                $('.tmb').attr('src', images[0].url)
            });
    });
}).end();
