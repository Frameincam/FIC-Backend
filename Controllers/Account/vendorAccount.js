import { OAuth2Client } from "google-auth-library";
import fetch from "node-fetch";
import bcrypt from "bcryptjs";

import Vendor from "../../Models/Account/vendorAccount.js";
import { generateToken } from "../../Utils/jwtToken.js";
import { downloadFile, uploadfile, uploadfiles } from "../../Utils/s3Bucket.js";
import VendorPictures from "../../Models/Account/vendorPictures.js";
import generateOTP from "../../Utils/sendOtp.js";

const client = new OAuth2Client(
	"1044646467235-3qsh4khsql66k1v9p6nuh6h5476gd09j.apps.googleusercontent.com"
);

export const registerOtpSend = async (req, res) => {
	const to = req.params.number;
	const userType = req.body.type;
	const msg = process.env.REGISTOR_MESSAGE;
	const template_id = process.env.DLT_REGISTRATION;
	const otpType = "register";
	try {
		// console.log(to);
		return await generateOTP(to, msg, template_id, userType, otpType, req, res);
	} catch (error) {
		return res.json({
			success: false,
			msg: "Something Went Wrong",
			error: error,
		});
	}
};

// Registration Start
export const vendorRegistration = async (req, res) => {
	try {
		let { name, password, mobile, email } = req.body;
		let findEmail = await Vendor.findOne({ email });
		let findMobile = await Vendor.findOne({ mobile });
		if (findEmail || findMobile) {
			if (findEmail && findMobile)
				return res.json({
					success: false,
					msg: "Email And Mobile Number Already Exist",
				});
			if (findEmail)
				return res.json({ success: false, msg: "Email Already Exist" });
			if (findMobile)
				return res.json({ success: false, msg: "Mobile Number Already Exist" });
		}
		const salt = await bcrypt.genSalt(10);
		password = await bcrypt.hash(password, salt);
		const registrationType = "manual";
		const type = "photographer";
		let user = await new Vendor({
			name,
			password,
			mobile,
			email,
			type,
			registrationType,
		});
		await user.save();
		// user = user.toObject();
		// delete user.password;
		const logintoken = { id: user._id };
		const token = await generateToken(logintoken);
		return res.json({
			success: true,
			user: user,
			token: token,
			msg: "Registration Success",
		});
	} catch (err) {
		return res.json({ success: false, msg: "Something Went Wrong", err: err });
	}
};
//Registration End

//Login Start
export const vendorLogin = async (req, res) => {
	const { mobile, password } = req.body;
	try {
		const user = await Vendor.findOne({ mobile });
		if (!user)
			return res.json({
				success: false,
				msg: "Mobile Not Found, Please Register",
			});
		if (user.registrationType !== "manual")
			return res.json({
				success: false,
				msg:
					"you are registered on " +
					user.registrationType +
					" so please login with " +
					user.registrationType,
			});
		const passwordcrct = await bcrypt.compare(password, user.password);
		console.log(passwordcrct, "passwordMatch");
		if (!passwordcrct)
			return res.json({ success: false, msg: "Incorrect Password" });
		const logintoken = { id: user._id };
		const token = await generateToken(logintoken);
		return res.json({
			success: true,
			msg: "Login Success",
			token: token,
			user: user,
		});
	} catch (err) {
		return res.json({ success: false, msg: "Something Went Wrong", err: err });
	}
};
// Login End

// Google Registration Start
export const vendorGoogleRegitration = async (req, res, next) => {
	const { tokenId } = req.params;
	try {
		const { payload } = await client.verifyIdToken({
			idToken: tokenId,
			audience:
				"1044646467235-3qsh4khsql66k1v9p6nuh6h5476gd09j.apps.googleusercontent.com",
		});
		if (!payload.email_verified)
			return res.json({ success: false, msg: "Email verification failed" });
		const email = payload.email;
		const name = payload.name;
		const findEmail = await Vendor.findOne({ email });
		if (findEmail)
			return res.json({ success: false, msg: "Account Already Exist" });
		const registrationType = "google";
		const type = "photographer";
		let user = await new Vendor({ name, email, type, registrationType });
		await user.save();
		const logintoken = { id: user._id };
		const token = await generateToken(logintoken);
		return res.json({
			success: true,
			user: user,
			token: token,
			msg: "Google Registration Success",
		});
	} catch (err) {
		return res.json({ success: false, msg: "Something Went Wrong", err: err });
	}
};
// Google Registration End

// Google Login Start
export const vendorGoogleLogin = async (req, res, next) => {
	const { tokenId } = req.body;
	try {
		const { payload } = await client.verifyIdToken({
			idToken: tokenId,
			audience:
				"1044646467235-3qsh4khsql66k1v9p6nuh6h5476gd09j.apps.googleusercontent.com",
		});
		if (!payload.email_verified)
			return res.json({ success: false, msg: "Email Verification Failed" });
		const email = payload.email;
		const user = await Vendor.findOne({ email });
		if (!user)
			return res.json({
				success: false,
				msg: "Account Not Found, Please Register",
			});
		if (user.registrationType !== "google")
			return res.json({
				success: false,
				msg:
					"you are registered on " +
					user.registrationType +
					" so please login with " +
					user.registrationType,
			});
		const logintoken = { id: user._id };
		const token = await generateToken(logintoken);
		return res.json({
			success: true,
			user: user,
			token: token,
			msg: "Google Login Success",
		});
	} catch (error) {
		return res.json({
			success: false,
			msg: "something went wrong",
			err: error,
		});
	}
};
// Google Login End

// Facebook Registration Start
export const vendorFacebookRegistration = async (req, res, next) => {
	const { accessToken, userId } = req.body;
	console.log(userId);
	try {
		const urlGraphFb = `https://graph.facebook.com/v2.11/${userId}/?fields=id,name,email&access_token=${accessToken}`;
		fetch(urlGraphFb, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((response) => {
				fb(response);
			});
		const fb = async (response) => {
			const { email, mobile, name } = response;
			console.log(email, name, mobile);
			const findEmail = await Vendor.findOne({ email });
			const findMobile = await Vendor.findOne({ mobile });
			console.log(findEmail);
			if (findEmail)
				return res.json({ success: false, msg: "Account Already Exist" });
			const type = "photographer";

			const registrationType = "facebook";
			let user = await new Vendor({
				name,
				email,
				mobile,
				type,
				registrationType,
			});
			await user.save();
			const logintoken = { id: user._id };
			const token = generateToken(logintoken);
			console.log(token);
			return res.json({
				success: true,
				msg: "Facebook Registration Success",
				user: user,
				token: token,
			});
		};
	} catch (error) {
		return res.json({ suceess: false, msg: "something went wrong", err });
	}
};

// Facebook Registration End

// Facebook Login Start
export const vendorFacebookLogin = async (req, res, next) => {
	const { accessToken, userId } = req.body;
	try {
		const urlGraphFb = `https://graph.facebook.com/v2.11/${userId}/?fields=id,name,email&access_token=${accessToken}`;
		fetch(urlGraphFb, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((response) => {
				fb(response);
			});
		const fb = async (response) => {
			const { email, mobile, name } = response;
			let findEmail = await Vendor.findOne({ email });
			console.log(findEmail);
			const findMobile = Vendor.findOne({ mobile });
			const userEmail = await Vendor.findOne({ email });
			const userMobile = await Vendor.findOne({ mobile });
			if (!userEmail)
				return res.json({
					success: false,
					msg: "Account Not Found Plaese Register",
				});
			let loginToken;
			if (userEmail) loginToken = { id: userEmail._id };
			if (userMobile) loginToken = { id: userMobile._id };
			console.log(userEmail);
			const token = await generateToken(loginToken);
			if (userEmail.registrationType !== "facebook")
				return res.json({
					success: false,
					msg:
						"you are registered on " +
						userEmail.registrationType +
						" so please login with " +
						userEmail.registrationType,
				});
			if (userEmail)
				return res.json({
					success: true,
					msg: "Facebook Login Success",
					token: token,
					user: userEmail,
				});
			if (userMobile)
				return res.json({
					success: true,
					msg: "Facebook Login Success",
					token: token,
					user: userMobile,
				});
		};
	} catch (error) {
		return res.json({ success: false, msg: "something went wrong", err });
	}
};
// Facebook Login End

// Get Specific Vendor Profile by Id Start
export const getVendorProfile = async (req, res, next) => {
	const id = req.params.id;
	console.log(id, "id");
	try {
		let vendor = await Vendor.findById(id);
		if (!vendor) return res.json({ success: false, msg: "Vendor Not Found" });
		return res.json({ success: true, vendor: vendor });
	} catch (error) {
		return res.json({
			success: false,
			msg: "Something went worng",
			err: error,
		});
	}
};
// Get Specific Vendor Profile By Id End

// update Vendor Profile Start
export const updateVendorProfile = async (req, res, next) => {
	const id = req.user.id;
	try {
		const vendor = await Vendor.findById(id);
		if (!vendor)
			return res.json({ success: false, msg: "Vendor Profile Not Found" });
		await Vendor.findByIdAndUpdate({ _id: id }, { $set: req.body });
		const ven = await Vendor.findById(id);
		return res.json({ success: true, vendor: ven, msg: "Profile Updated" });
	} catch (error) {
		return res.json({
			success: false,
			msg: "something went wrong",
			err: error,
		});
	}
};
// update Vendor Profile End

export const getAllVendors = async (req, res, next) => {
	try {
		const vendors = await Vendor.find();
		return res.json({ success: true, vendors: vendors });
	} catch (error) {
		return res.json({
			success: false,
			msg: "something went wrong",
			err: error,
		});
	}
};

export const uploadVendorProfile = async (req, res, next) => {
	const file = req.file;
	console.log("file start", file, "file end");
	try {
		const result = await uploadfile(file);
		const profilePicture = result.Key;
		console.log(profilePicture);
		const id = req.user._id;
		await Vendor.findByIdAndUpdate({ _id: id }, { profilePicture });
		const ven = await Vendor.findById(id);
		return res.json({
			success: true,
			msg: "Profile Photo Uploaded Successfully",
			vendor: ven,
		});
	} catch (error) {
		return res.json({
			success: false,
			msg: "something went wrong",
			error: error,
		});
	}
};

export const uploadVendorCover = async (req, res, next) => {
	const file = req.file;
	console.log("file start", file, "file end");
	try {
		const result = await uploadfile(file);
		const coverPicture = result.Key;
		console.log(coverPicture);
		const id = req.user._id;
		const ven = await Vendor.findByIdAndUpdate({ _id: id }, { coverPicture });
		return res.json({
			success: true,
			msg: "Cover Photo Uploaded Successfully",
			vendorCoverPicture: ven.coverPicture,
		});
	} catch (error) {
		return res.json({
			success: false,
			msg: "something went wrong",
			error: error,
		});
	}
};

export const getPhoto = async (req, res, next) => {
	try {
		const key = req.params.id;
		console.log(key, "key");
		if (key != "undefined") {
			const readStream = await downloadFile(key);
			return await readStream.pipe(res);
		} else {
			return console.log(key);
		}
	} catch (error) {
		return req.json({
			success: false,
			msg: "Something went wrong",
			error: error,
		});
	}
};

// Upload Vendor Photos Start
export const uploadVendorPhotos = async (req, res, next) => {
	const files = req.files;
	const id = req.user.id;
	try {
		const vendorFind = await Vendor.findById(id);
		if (!vendorFind)
			return res.json({ success: false, msg: "Account Not Found" });
		const results = await uploadfiles(files);
		const vendorPictures = vendorFind.vendorPictures;
		for (var i = 0; i < results.length; i++) {
			vendorPictures.push(results[i].key);
		}

		console.log(vendorFind._id);
		console.log(vendorPictures);
		const vendor = await Vendor.findByIdAndUpdate(
			{ _id: id },
			{ vendorPictures }
		);
		return res.json({
			success: true,
			msg: "Photos Uploaded Successfully",
			vendorPictures: vendorPictures,
		});
	} catch (error) {
		return res.json({
			success: false,
			msg: "something went wrong",
			err: error,
		});
	}
};
// Upload Vendor Photos End

// Delete Vendor Photos Start
export const deleteVendorPhotos = async (req, res) => {
	const id = req.user.id;
	const imageId = req.body.pictureId;
	try {
		const vendorFind = await Vendor.findById(id);
		if (!vendorFind)
			return res.json({ success: false, msg: "Account Not Found" });
		const vendorPic = vendorFind.vendorPictures;
		const vendorPictures = vendorPic.filter((pic) => pic != imageId);
		console.log(vendorFind._id);
		console.log(vendorPictures);
		await Vendor.findByIdAndUpdate({ _id: id }, { vendorPictures });
		return res.json({
			success: true,
			msg: "Photo Deleted Successfully",
			vendorPictures: vendorPictures,
		});
	} catch (error) {
		return res.json({
			success: false,
			msg: "something went wrong",
			err: error,
		});
	}
};
// Delete Vendor Photos End

// Customer Like And UnLike Start
// export const customerLikeOrUnlike = async (req, res) => {
//   const customerId = req.user.id;
//   const vendorId = req.body.vendorId;
//   try {
//     const vendorFind = await Vendor.findById(vendorId);
//     // console.log(vendorFind, "vendor");
//     const like = vendorFind.likedCustomers;
//     const liked = like.some((l) => l == customerId);
//     console.log(liked, 'liked')
//     if (liked) {
//       let likedCustomers = like.filter(l != customerId);
//       console.log('unlike');
//       await Vendor.findByIdAndUpdate({ _id: vendorId }, { likedCustomers });
//       return res.json({ success: true, msg: "Unlike Success", like: false });
//     }
//     if (!liked) {
//       console.log(customerId, "id");
//       let likedCustomers = like.push(customerId);
//       console.log(likedCustomers, 'like')
//       await Vendor.findByIdAndUpdate({ _id: vendorId }, { likedCustomers });
//       return res.json({ success: true, msg: "Like Success", like: true });
//     }
//   } catch (error) {
//     return res.json({
//       success: false,
//       msg: "something went wrong",
//       error: error,
//     });
//   }
// };

export const customerLikeOrUnlike = async (req, res) => {
	const customerId = req.user.id;
	const vendorId = req.body.vendorId;
	try {
		console.log(vendorId, "id");
		const vendorFind = await Vendor.findById(vendorId);
		let likedCustomers = vendorFind.likedCustomers;
		const liked = likedCustomers.some((l) => l == customerId);
		if (liked) {
			likedCustomers = likedCustomers.filter((l) => l != customerId);
			console.log(likedCustomers);
			await Vendor.findByIdAndUpdate({ _id: vendorId }, { likedCustomers });
			return res.json({ success: true, msg: "Unlike Success", like: false });
		}
		if (!liked) {
			likedCustomers.push(customerId);
			// console.log(like)
			console.log(customerId);
			console.log(likedCustomers, "ch");
			await Vendor.findByIdAndUpdate({ _id: vendorId }, { likedCustomers });
			return res.json({ success: true, msg: "Like Success", like: true });
		}
	} catch (error) {
		return res.json({ success: false, msg: "someth went wrong", error: error });
	}
};

// Customer Like And UnLike End
