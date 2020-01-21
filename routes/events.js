const express = require('express');
const router = express.Router();
const Insta = require('instamojo-nodejs');
const loggedin = require('../services/middleware');
const GoogleUser = require('../models/GoogleUser');
const LocalUser = require('../models/LocalUser');
const Event = require('../models/Event.js');

const url = require('url');

/*Access for all the routes is private expect GET /events route.*/

//Route GET /events
//Getting all Events from the database
router.get('/type/:id', (req, res) => {
	Event.find({ "typeOfEvent": req.params.id })
		.then((events) => res.json(events))
});

router.get('/:id', (req, res) => {
	Event.findOne({ "eventId": req.params.id })
		.then((event) => res.json(event))
		.catch((err) => {
			throw err;
		});
});

router.post('/registerfree', loggedin, async(req, res) => {
	const user = req.session.passport.user;
	var name_id;
	//console.log("Log : ", req.body.event_id);
	if (user.googleid)
	{
		name_id = 'g_' + user._id; 
		//console.log("Name_id : ", name_id);
		await GoogleUser.updateOne({ _id: user._id },
			{
				$push: { registeredeventids: req.body.event_id }
			});
		////console.log("Local Event");
		await Event.updateOne({
			eventId: req.body.event_id
		},
			{
				$push: { participants : name_id }
			})
	}	
	else
	{
		name_id = 'l_' + user._id;
		await LocalUser.updateOne({ _id: user._id },
			{
				$push: { registeredeventids: req.body.event_id }
			});
		////console.log("Local Event");
		await Event.updateOne({
			eventId: req.body.event_id
		},
			{
				$push: { participants: name_id }
			})
	}
	res.send({ valid: true });
});


router.post('/create', (req, res) => {
	let nnm = 0;
	Event.estimatedDocumentCount((err, res) => {
		if (!err)
			nnm = res + 1;
	})
		.then(() => {
			const newEvent = Event({
				name: req.body.name,
				eventId: nnm,
				description: req.body.description,
				typeOfEvent: req.body.typeOfEvent,
				entryfee: req.body.entryfee
			});
			newEvent.save()
				.then(event => res.json(event));
		});
});

//api/events/register
router.post('/register', loggedin, (req, res) => {
	Event.findOne({ eventId: req.body.eventId })
		.then((event) => {
			if (event) {
				Insta.setKeys(process.env.TEST_API_KEY, process.env.TEST_AUTH_TOKEN);
				const data = new Insta.PaymentData();
				Insta.isSandboxMode(true);
				var type;
				const user = req.session.passport.user;
				if (user.googleid)
					type = 'google';
				else
					type = 'local';
				data.purpose = event.name + ' Registration';
				data.amount = event.entryfee;
				data.buyer_name = user.name;
				data.redirect_url = `http://localhost/api/events/register/callback?user_id=${user._id}&type=${type}&event_id=${event.eventId}`;
				data.email = user.email;
				data.send_mail = true;
				data.allow_repeated_payments = false;

				Insta.createPayment(data, (err, pres) => {
					if (err) {
						res.send({ success: false, error: true });
					}
					else {
						////console.log(pres);
						const response = JSON.parse(pres);
						res.status(200).json(response);
					}
				});
			}
			else {
				res.send({ valid: true, isevent: false });
			}
		})
		.catch(err => {
			res.send({ valid: false });
		});
});

router.get('/register/callback', async(req, res) => {
	let url_parts = url.parse(req.url, true);
	var responseData = url_parts.query;
	////console.log(responseData);
	////console.log("Callback");
	if (responseData.type === 'local') {
		const name_id = 'l_' + responseData.user_id;
		const did = parseInt(responseData.event_id);
		////console.log("Local");
		await LocalUser.updateOne({ _id: responseData.user_id },
			{
				$push: { registeredeventids: did }
			});
		////console.log("Local Event");
		await Event.updateOne({
			eventId: responseData.event_id
		},
			{
				$push: { participants: name_id }
			})
		res.redirect('http://localhost/dashboard');
	}
	else if (responseData.type === 'google') {
		const name_id = 'g_' + responseData.user_id;
		const did = parseInt(responseData.event_id);
		////console.log("Google");
		await GoogleUser.updateOne({ _id: responseData.user_id },
			{
				$push: { registeredeventids: did }
			});
		////console.log("Google Event");
		await Event.updateOne({
			eventId: responseData.event_id
		},
			{
				$push: { participants: name_id }
			})
	}
	res.redirect('http://localhost/dashboard');
});

module.exports = router;