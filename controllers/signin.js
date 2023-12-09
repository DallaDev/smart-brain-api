const handleSignin = (req, res, knex, bcrypt) => {
    const { email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }
    knex.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                knex.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(404).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
    handleSignin: handleSignin
}