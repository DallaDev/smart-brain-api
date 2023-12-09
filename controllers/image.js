require('dotenv').config();



const handleApiCall = (req, res) => {
    const { imageUrl } = req.body;
    const PAT = process.env.CLARIFAI_API_KEY;
    const USER_ID = 'dalla88';       
    const APP_ID = 'ZTMproject';
    const IMAGE_URL = imageUrl;
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": imageUrl 
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Key ${PAT}`
        },
        body: raw
    };
    
    fetch('https://api.clarifai.com/v2/models/face-detection/outputs', requestOptions)
        .then((clarifaiResponse) => {
            if (clarifaiResponse.ok) {
                return clarifaiResponse.json();
            }
            throw new Error('Clarifai request failed');
        })
        .then((clarifaiData) => {
            // Send the Clarifai response back to the frontend
            res.json(clarifaiData);
        })
        .catch((error) => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

const handleImagePut = (req, res, knex) => {
    const { id } = req.body;
    knex('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to update entry', err))
}

module.exports = {
    handleImagePut: handleImagePut,
    handleApiCall: handleApiCall
}