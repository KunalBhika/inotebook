const express = require('express');
const router = express.Router();

router.get('/' , (req , res) => {
    let obj = {
        id : 231102,
        name : 'Kunal Bhika',
        title : 'The legends of Hakim Lukka',
        description : '....'
    }
    res.json(obj);
})

module.exports = router;