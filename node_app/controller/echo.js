const express = require('express')
const router = express.Router()

router.get('/echo_get', (req, res) => {
  res.json("Echo from router..........Hello");
})

router.get('/echo_qs', (req, res) => {
  res.json(req.query);
})

router.get('/echo_params/:params', (req, res) =>{
  res.json(req.params);
})

router.post('/echo_post', (req,res) => {
  res.json(req.body);
})

module.exports = router