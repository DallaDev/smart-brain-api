const handleProfileGet = (req, res, knex) => {
    const { id } = req.params;
    knex.select('*').from('users').where({id})
        .then(user => {
            if (user.length) {
               res.json(user[0]) 
            } else {
                res.status(404).json('Not Found');
            }
        })
        .catch(error => res.status(404).json('error getting user'))
}

module.exports = {
    handleProfileGet: handleProfileGet
}