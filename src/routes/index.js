const user = require('./user')

function router(app){
    app.use('/api/user/',user )
}

module.exports = router;