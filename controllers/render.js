

class siwesRoutes {

    static index ( req, res ) {
        return res.status(200).render('index');
        // return res.status(200).sendFile(path.join(__dirname, '..', '..', 'frontend', 'index.html'));
    }

    static register(req, res, next) {
            return res.status(200).render('register');
    }

    static login(req, res, next) {
            return res.status(200).render('login');
    }

    static chat(req, res, next) {
        
        return res.status(200).render('chat');
    }

}

module.exports = siwesRoutes;