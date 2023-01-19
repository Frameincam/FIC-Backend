import React, { useState, useEffect } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import PageWrapper from "../components/PageWrapper";
import { useRouter } from "next/router";
import axios from "axios";
import swal from "sweetalert";

import icon1 from "../assets/image/inner/icon-preferences.svg";
import icon2 from "../assets/image/inner/icon-cart.svg";
import icon3 from "../assets/image/inner/icon-coupon.svg";
import icon4 from "../assets/image/inner/icon-layers.svg";
import icon5 from "../assets/image/inner/icon-async.svg";
import icon6 from "../assets/image/inner/icon-chartbar.svg";

const Pricing1 = () => {
	const [isMonthly, setIsMonthly] = useState(false);

	const [details, setDetails] = useState([]);
	const [name, setName] = useState("account");

	useEffect(() => {
		let u = JSON.parse(localStorage.getItem("user"));
		if (u !== undefined && u !== null) {
			setDetails(u);
			setName(u.name);
		}
	}, []);

	const router = useRouter();

	const initializeRazorpay = () => {
		return new Promise((resolve) => {
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";

			script.onload = () => {
				resolve(true);
			};
			script.onerror = () => {
				resolve(false);
			};

			document.body.appendChild(script);
		});
	};

	const initPayment = async (data, packName) => {
		const res = await initializeRazorpay();
		const options = {
			key: process.env.KEY_ID,
			amount: data.amount,
			currency: data.currency,
			name: "ImageProof.ai",
			description: packName,
			order_id: data.id,
			prefill: {
				email: details.email,
				contact: details.mobile,
			},
			handler: async (response) => {
				try {
					const { data } = await axios.post(
						`https://beta.imageproof.ai/api/verify`,
						response
					);
					console.log(data.photogapher);

					if (data.success) {
						let u = JSON.stringify(data.photogapher);
						localStorage.setItem("user", u);
						swal({
							title: "Success",
							text: data.msg,
							icon: "success",
							button: "Ok",
						});
						router.push("/download");
					} else {
						swal({
							title: "Error",
							text: data.msg,
							icon: "error",
							button: "Ok",
						});
					}
				} catch (error) {
					console.log(error);
				}
			},
		};
		const rzp1 = new window.Razorpay(options);
		rzp1.open();
	};

	const handlePayment = async (packName) => {
		console.log(details, "details");
		if (details !== null) {
			if (details.subscribedValidity) {
				swal({
					title: "Error",
					text: "You are already subscribed",
					icon: "error",
					button: "OK",
				});
				router.push("/download");
			} else {
				// let pack;
				try {
					// isMonthly ? (pack = "monthly") : (pack = "yearly");
					// console.log(pack);
					const d = {
						pack: packName,
					};
					const { data } = await axios.post(
						`https://beta.imageproof.ai/api/orders`,
						d
					);
					console.log(data);
					initPayment(data.data, packName);
				} catch (error) {
					console.log(error);
				}
			}
		} else {
			router.push("/signin");
		}
	};

	// Free Trial subscription

	const handleFreeTrial = async () => {
		if (details !== null) {
			if (details.packageName === "Free Trial" || details.subscribedValidity) {
				swal({
					title: "Error",
					text: "You are already subscribed to free trial",
					icon: "error",
					button: "OK",
				});
				router.push("/download");
			} else {
				console.log(details._id);
				const d = {
					id: details._id,
				};
				try {
					const { data } = await axios.put(
						`https://beta.imageproof.ai/api/free-trial`,
						d
					);
					console.log(data);
					if (data.success) {
						let u = JSON.stringify(data.data);
						localStorage.setItem("user", u);
						swal({
							title: "Success",
							text: data.msg,
							icon: "success",
							button: "OK",
						});
						router.push("/download");
					} else {
						swal({
							title: "Error",
							text: data.msg,
							icon: "error",
							button: "Ok",
						});
					}
				} catch (error) {
					console.log(error);
				}
			}
		} else {
			router.push("/signin");
		}
	};

	return (
		<>
			<PageWrapper
				headerConfig={{
					align: "right",
					button: name, // cta, account, null
				}}
				title="Pricing"
			>
				<div className="inner-banner bg-default-2 pt-25 pt-lg-29">
					<Container>
						<h2 className="title gr-text-3 mb-8 heading-color text-center">
							Our features
						</h2>
						<div class="table-responsive">
							<table
								class="table table-striped text-successtable-border border-light "
								style={{ border: "1px solid" }}
							>
								<thead class="border-light">
									<tr>
										<th scope="col">Features</th>
										<th scope="col">
											<strong>Free Trial</strong>
										</th>
										{/* <th scope="col">
                      <strong>Bronze</strong>
                    </th> */}
										<th scope="col">
											<strong>1 Month</strong>
										</th>
										<th scope="col">
											<strong>3 Months</strong>
										</th>
										{/* <th scope="col">
                      <strong>Platinum</strong>
                    </th> */}
									</tr>
								</thead>
								<tbody>
									<tr>
										<th scope="row">Projects</th>
										<td>1</td>
										<td>Unlimited </td>
										{/* <td>Unlimited </td> */}
										<td>Unlimited </td>
										{/* <td>Unlimited </td> */}
									</tr>
									<tr>
										<th scope="row">Events</th>
										<td>2</td>
										<td>Unlimited </td>
										{/* <td>Unlimited </td> */}
										<td>Unlimited </td>
										{/* <td>Unlimited </td> */}
									</tr>
									<tr>
										<th scope="row">Secure Albums</th>
										<td>
											<i style={{ color: "red" }}>-</i>
										</td>
										{/* <td>
                      <i class="fas fa-check" style={{ color: "green" }}></i>
                    </td> */}
										<td>
											<i class="fas fa-check" style={{ color: "green" }}></i>
										</td>
										<td>
											<i class="fas fa-check" style={{ color: "green" }}></i>
										</td>
										{/* <td>
											<i class="fas fa-check" style={{ color: "green" }}></i>
										</td> */}
									</tr>
									<tr>
										<th scope="row">Lifetime Updates</th>
										<td>
											<i style={{ color: "red" }}>-</i>
										</td>
										{/* <td>
                      <i class="fas fa-check" style={{ color: "green" }}></i>
                    </td> */}
										<td>
											<i class="fas fa-check" style={{ color: "green" }}></i>
										</td>
										<td>
											<i class="fas fa-check" style={{ color: "green" }}></i>
										</td>
										{/* <td>
											<i class="fas fa-check" style={{ color: "green" }}></i>
										</td> */}
									</tr>
									<tr>
										<th scope="row">Photo limit per project</th>
										<td>1000</td>
										{/* <td>Unlimited </td> */}
										<td>Unlimited </td>
										<td>Unlimited </td>
										{/* <td>Unlimited </td> */}
									</tr>
									<tr>
										<th scope="row">Tech Support</th>
										<td>
											<i style={{ color: "red" }}>-</i>
										</td>
										{/* <td>24 X 7 </td> */}
										<td>24 X 7 </td>
										<td>24 X 7 </td>
										{/* <td>24 X 7 </td> */}
									</tr>
									<tr>
										<th scope="row">Price / Validity</th>
										<td class="fw-bold">Free</td>
										{/* <td class="fw-bold"> ₹1499/1m</td> */}
										<td class="fw-bold">₹1000/1m</td>
										<td class="fw-bold">₹2400/3m</td>
										{/* <td class="fw-bold">₹13499/year</td> */}
									</tr>
								</tbody>
							</table>
							<h6>Refund Policy</h6>
							<p>
								* All pricing plans are not subjected to any refund, if they
								have been used within the first 48 hours of enrolling to the
								plan.
							</p>
						</div>
						<Row className="justify-content-center pt-5 mt-10">
							<Col lg="9" xl="8">
								<div className="px-md-15 text-center mb-5 mb-lg-13">
									<h2 className="title gr-text-2 mb-9 mb-lg-12 heading-color">
										Pricing &amp; Plans
									</h2>
									<p className="gr-text-8 mb-0 text-color-opacity">
										We Keep Things Simple here at Image Proof.
									</p>
								</div>
							</Col>
						</Row>
					</Container>
				</div>
				<div className="pricing-section bg-default-2 pb-7 pb-lg-10">
					<Container>
						{/* <div className="text-center pt-9">
              <div
                className="mb-13 d-inline-flex position-relative"
                id="pricing-dynamic-deck--head"
              >
                <span className="period month gr-text-8 gr-text-color ">
                  Monthly
                </span>
                <a
                  href="/#"
                  className={`btn-toggle mx-3 price-deck-trigger ${isMonthly ? "" : "active"
                    }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMonthly(!isMonthly);
                  }}
                >
                  <span className="round"></span>
                </a>
                <span className="period year gr-text-8 gr-text-color">
                  Yearly
                </span>
                <span className="badge gr-badge text-primary gr-text-12 gr-bg-blue-opacity-1 rounded-pill ms-5 text-uppercase">
                  Save 25%
                </span>
              </div>
            </div> */}
						<Row className="justify-content-center">
							<Col lg="4" md="6" sm="10" className="mb-9">
								<div className="pricing-card bg-white gr-hover-shadow-1 border text-left pt-9 pb-9 pe-9 pe-xl-13  ps-9 ps-xl-13 bg-white rounded-10">
									<div className="price-content">
										<span className="small-title gr-text-12 text-primary font-weight-bold text-uppercase">
											Trial
										</span>
										<div className="d-flex align-items-end mt-11 ">
											{/* <span className="currency me-2 gr-text-6 font-weight-bold line-spacing-none text-blackish-blue">
                          Free
                        </span> */}
											<h2 className="price-value gr-text-2 font-weight-bold line-spacing-none mb-0 text-blackish-blue">
												Free Trial
												<span className="d-none"></span>
											</h2>
											{/* <span className="per gr-text-9 text-blackish-blue">
                          /month
                        </span> */}
										</div>
										{/* <span className="price-bottom-text gr-text-11 mt-5 text-blackish-blue gr-opacity-7 d-inline-flex">
                        {" "}
                        {isMonthly ? "billed monthly" : "billed yearly"}
                      </span> */}
										<ul className="card-list list-style-check ps-0 mt-7 mt-lg-11">
											<li className="gr-text-9">
												<i className="icon icon-check-simple"></i>1 Project
											</li>
											<li className="gr-text-9">
												<i className="icon icon-check-simple"></i>2 Events
											</li>
											<li className="gr-text-9">
												<i className="icon icon-check-simple"></i>1000 Photos
											</li>
											<li className="gr-text-9">
												<i className="icon icon-check-simple"></i>30 day Storage
											</li>
											<li className="gr-text-9"> </li>
											<li className="gr-text-9"> </li>
										</ul>
									</div>
									<Button
										className="with-icon gr-hover-y px-xl-8 px-lg-4 px-sm-8 px-4"
										onClick={handleFreeTrial}
									>
										Start Free Trial
										<i className="icon icon-tail-right font-weight-bold"></i>
									</Button>
									{/* <span className="btn-bottom-text d-block gr-text-11 text-blackish-blue gr-opacity-7 mt-5">
                      No credit card required
                    </span> */}
								</div>
							</Col>
						</Row>
						<Row className="justify-content-center">
							{/* <Col lg="3" md="6" sm="10" className="mb-9 p-2">
                <div className="pricing-card bg-white gr-hover-shadow-1 border text-left pt-9 pb-9 pe-9 pe-xl-13  ps-9 ps-xl-13 bg-white rounded-10">
                  <div className="price-content">
                    <span className="small-title gr-text-12 text-primary font-weight-bold text-uppercase">
                      Bronze
                    </span>
                    <div className="d-flex align-items-end mt-11">
                      <span className="currency me-2 gr-text-6 font-weight-bold line-spacing-none text-blackish-blue">
                        ₹
                      </span>
                      <h2 className="price-value gr-text-2 font-weight-bold line-spacing-none mb-0  text-blackish-blue"> */}
							{/* {isMonthly ? "129" : "99"}1499 */}
							{/* <span className="d-none">.</span> */}
							{/* </h2> */}
							{/* <span className="per gr-text-9 text-blackish-blue">
                        1/month
                      </span> */}
							{/* </div>
                    <ul className="card-list list-style-check ps-0 mt-7 mt-lg-8">
                      <li className="gr-text-9">
                        <i style={{ marginTop: "unset" }}>Extra</i>GST - 18%
                      </li>
                    </ul>
                    <span className="price-bottom-text gr-text-11 mt-5 text-blackish-blue gr-opacity-7 d-inline-flex">
                      {"Billed Monthly "} */}
							{/* {isMonthly ? "billed monthly" : "billed yearly"} */}
							{/* </span> */}
							{/* <ul className="card-list list-style-check ps-0 mt-7 mt-lg-11">
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>Commercial
                        License
                      </li>
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>100+ HTML UI
                        Elements
                      </li>
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>Unlimited
                        Domain Support
                      </li>
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>6 months
                        premium support
                      </li>
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>Lifetime
                        updates
                      </li>
                    </ul> */}
							{/* </div> */}
							{/* <Button */}
							{/* className="with-icon gr-hover-y px-xl-8 px-lg-4 px-sm-8 px-4"
                    onClick={() => handlePayment("bronze")}
                  >
                    Pay Now
                    <i className="icon icon-tail-right font-weight-bold"></i>
                  </Button> */}
							{/* <span className="btn-bottom-text d-block gr-text-11 text-blackish-blue gr-opacity-7 mt-5">
                      No credit card required
                    </span> */}
							{/* </div> */}
							{/* </Col> */}
							<Col lg="3" md="6" sm="10" className="mb-9 p-2">
								<div className="pricing-card bg-white gr-hover-shadow-1 border text-left pt-9 pb-9 pe-9 pe-xl-13  ps-9 ps-xl-13 bg-white rounded-10">
									<div className="price-content">
										<span className="small-title gr-text-12 text-primary font-weight-bold text-uppercase">
											1 Month
										</span>
										<div className="d-flex align-items-end mt-11">
											<span className="currency me-2 gr-text-6 font-weight-bold line-spacing-none text-blackish-blue">
												₹
											</span>
											<h2 className="price-value gr-text-2 font-weight-bold line-spacing-none mb-0  text-blackish-blue">
												{/* {isMonthly ? "129" : "99"} */} 1000
												<span className="d-none">.</span>
											</h2>
											{/* <span className="per gr-text-9 text-blackish-blue">
                        3/month
                      </span> */}
										</div>
										<ul className="card-list list-style-check ps-0 mt-7 mt-lg-8">
											<li className="gr-text-9">
												<i style={{ marginTop: "unset" }}>Extra</i>GST - 18%
											</li>
										</ul>
										<span className="price-bottom-text gr-text-11 mt-5 text-blackish-blue gr-opacity-7 d-inline-flex">
											{/* {"Biled Quarterly "} */}
											{/* {isMonthly ? "billed monthly" : "billed yearly"} */}
										</span>
										{/* <ul className="card-list list-style-check ps-0 mt-7 mt-lg-11">
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>Commercial
                        License
                      </li>
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>100+ HTML UI
                        Elements
                      </li>
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>Unlimited
                        Domain Support
                      </li>
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>6 months
                        premium support
                      </li>
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>Lifetime
                        updates
                      </li>
                    </ul> */}
									</div>
									<Button
										className="with-icon gr-hover-y px-xl-8 px-lg-4 px-sm-8 px-4"
										onClick={() => handlePayment("silver")}
									>
										Pay Now
										<i className="icon icon-tail-right font-weight-bold"></i>
									</Button>
									{/* <span className="btn-bottom-text d-block gr-text-11 text-blackish-blue gr-opacity-7 mt-5">
                      No credit card required
                    </span> */}
								</div>
							</Col>
							<Col lg="3" md="6" sm="10" className="mb-9 p-2">
								<div className="pricing-card bg-white gr-hover-shadow-1 border text-left pt-9 pb-9 pe-9 pe-xl-13  ps-9 ps-xl-13 bg-white rounded-10">
									<div className="price-content">
										<span className="small-title gr-text-12 text-primary font-weight-bold text-uppercase">
											3 Months
										</span>
										<div className="d-flex align-items-end mt-11">
											<span className="currency me-2 gr-text-6 font-weight-bold line-spacing-none text-blackish-blue">
												₹
											</span>
											<h2 className="price-value gr-text-2 font-weight-bold line-spacing-none mb-0  text-blackish-blue">
												{/* {isMonthly ? "129" : "99"} */} 2400
												<span className="d-none">.</span>
											</h2>
											{/* <span className="per gr-text-9 text-blackish-blue">
                        6/month
                      </span> */}
										</div>
										<ul className="card-list list-style-check ps-0 mt-7 mt-lg-8">
											<li className="gr-text-9">
												<i style={{ marginTop: "unset" }}>Extra</i>GST - 18%
											</li>
										</ul>
										<span className="price-bottom-text gr-text-11 mt-5 text-blackish-blue gr-opacity-7 d-inline-flex">
											{/* {" Billed Half Yearly "} */}
											{/* {isMonthly ? "billed monthly" : "billed yearly"} */}
										</span>
										{/* <ul className="card-list list-style-check ps-0 mt-7 mt-lg-11">
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>Commercial
                        License
                      </li>
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>100+ HTML UI
                        Elements
                      </li>
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>Unlimited
                        Domain Support
                      </li>
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>6 months
                        premium support
                      </li>
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>Lifetime
                        updates
                      </li>
                    </ul> */}
									</div>
									<Button
										className="with-icon gr-hover-y px-xl-8 px-lg-4 px-sm-8 px-4"
										onClick={() => handlePayment("gold")}
									>
										Pay Now
										<i className="icon icon-tail-right font-weight-bold"></i>
									</Button>
									{/* <span className="btn-bottom-text d-block gr-text-11 text-blackish-blue gr-opacity-7 mt-5">
                      No credit card required
                    </span> */}
								</div>
							</Col>

							{/* <Col lg="3" md="6" sm="10" className="mb-9 p-2">
								<div className="pricing-card bg-white gr-hover-shadow-1 border text-left pt-9 pb-9 pe-9 pe-xl-13  ps-9 ps-xl-13 bg-white rounded-10">
									<div className="price-content">
										<span className="small-title gr-text-12 text-primary font-weight-bold text-uppercase">
											Platinum
										</span>
										<div className="d-flex align-items-end mt-11 ">
											<span className="currency me-2 gr-text-6 font-weight-bold line-spacing-none text-blackish-blue">
												₹
											</span>
											<h2 className="price-value gr-text-2 font-weight-bold line-spacing-none mb-0 text-blackish-blue"> */}
							{/* {isMonthly ? "1499" : "13499"} */}
							{/* 13499 */}
							{/* <span className="d-none">.</span>
											</h2> */}
							{/* <span className="per gr-text-9 text-blackish-blue">
                        {isMonthly ? "/month" : "/year"} /Year
                      </span> */}
							{/* </div> */}
							{/* <ul className="card-list list-style-check ps-0 mt-7 mt-lg-8">
											<li className="gr-text-9">
												<i style={{ marginTop: "unset" }}>Extra</i>GST - 18%
											</li>
										</ul>
										<span className="price-bottom-text gr-text-11 mt-5 text-blackish-blue gr-opacity-7 d-inline-flex">
											{"Billed Yearly"} */}
							{/* {isMonthly ? "billed monthly" : "billed yearly"} */}
							{/* </span> */}
							{/* <ul className="card-list list-style-check ps-0 mt-7 mt-lg-11">
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>Unlimited
                        Projects
                      </li>
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>Unlimited
                        Events
                      </li>
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>24 X 7 Support
                      </li>
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>Secure Albums
                      </li>
                      <li className="gr-text-9">
                        <i className="icon icon-check-simple"></i>Lifetime
                        updates
                      </li>
                    </ul> */}
							{/* </div>
									<Button
										className="with-icon gr-hover-y px-xl-8 px-lg-4 px-sm-8 px-4"
										onClick={() => handlePayment("platinum")}
									>
										Pay Now
										<i className="icon icon-tail-right font-weight-bold"></i>
									</Button> */}
							{/* <span className="btn-bottom-text d-block gr-text-11 text-blackish-blue gr-opacity-7 mt-5">
                    No credit card required
                  </span> */}
							{/* </div>
							</Col> */}
						</Row>
					</Container>
				</div>
				<div className="bg-default-2 pb-7 pb-lg-15">
					<Container>
						<Row className="justify-content-center">
							<Col xl="8" lg="9">
								<div className="px-md-12 text-center mb-11 mb-lg-19">
									{/* <h2 className="title gr-text-3 mb-8 heading-color">
                    Check our features
                  </h2>
                  <ul
                    className="card-list list-style-check ps-0 mt-7 mt-lg-11"
                    style={{ margin: "0 auto" }}
                  >
                    <li className="gr-text-9">
                      <i className="icon icon-check-simple"></i>Unlimited
                      Projects
                    </li>
                    <li className="gr-text-9">
                      <i className="icon icon-check-simple"></i>Unlimited Events
                    </li>
                    <li className="gr-text-9">
                      <i className="icon icon-check-simple"></i>24 X 7 Support
                    </li>
                    <li className="gr-text-9">
                      <i className="icon icon-check-simple"></i>Secure Albums
                    </li>
                    <li className="gr-text-9">
                      <i className="icon icon-check-simple"></i>Lifetime updates
                    </li>
                  </ul> */}
									<p className="gr-text-8 mb-0 text-color-opacity">
										When Technology meets Passion You get ImageProof.ai.
									</p>
								</div>
							</Col>
						</Row>

						<Row className="justify-content-center">
							<Col lg="4" md="6" sm="6" xs="8" className=" mb-lg-18 mb-9">
								<div className="feature-card d-flex flex-column flex-md-row ">
									<div className="card-icon me-8 mt-2 mb-9 mb-md-0">
										<img src={icon1} alt="" />
									</div>
									<div className="card-texts">
										<h3 className="gr-text-7 mb-7 heading-color gr-text-exerpt">
											Simple Registration
										</h3>
										<p className="gr-text-9 mb-0 text-color-opacity">
											As simple as ordering a coffee from starbucks. Built
											keeping the non tech community in mind.
										</p>
									</div>
								</div>
							</Col>
							<Col lg="4" md="6" sm="6" xs="8" className="mb-lg-18 mb-9">
								<div className="feature-card d-flex flex-column flex-md-row ">
									<div className="card-icon me-8 mt-2 mb-9 mb-md-0">
										<img src={icon2} alt="" />
									</div>
									<div className="card-texts">
										<h3 className="gr-text-7 mb-7 heading-color gr-text-exerpt">
											Manage Multiple Customers
										</h3>
										<p className="gr-text-9 mb-0 text-color-opacity">
											We love it when you grow, manage as many customers as you
											want without restrictions.
										</p>
									</div>
								</div>
							</Col>
							<Col lg="4" md="6" sm="6" xs="8" className="mb-lg-18 mb-9">
								<div className="feature-card d-flex flex-column flex-md-row ">
									<div className="card-icon me-8 mt-2 mb-9 mb-md-0">
										<img src={icon3} alt="" />
									</div>
									<div className="card-texts">
										<h3 className="gr-text-7 mb-7 heading-color gr-text-exerpt">
											Manage Multiple Events
										</h3>
										<p className="gr-text-9 mb-0 text-color-opacity">
											We realise one work order can be multiple events, manage
											them seperately, create as many as you want under one
											project.
										</p>
									</div>
								</div>
							</Col>
							<Col lg="4" md="6" sm="6" xs="8" className="mb-lg-18 mb-9">
								<div className="feature-card d-flex flex-column flex-md-row ">
									<div className="card-icon me-8 mt-2 mb-9 mb-md-0">
										<img src={icon4} alt="" />
									</div>
									<div className="card-texts">
										<h3 className="gr-text-7 mb-7 heading-color gr-text-exerpt">
											Simple Selection
										</h3>
										<p className="gr-text-9 mb-0 text-color-opacity">
											We realise the most time taking process is photo
											selection, and we have made that to be as simple as a
											right swipe on tinder.
										</p>
									</div>
								</div>
							</Col>
							<Col lg="4" md="6" sm="6" xs="8" className="mb-lg-18 mb-9">
								<div className="feature-card d-flex flex-column flex-md-row ">
									<div className="card-icon me-8 mt-2 mb-9 mb-md-0">
										<img src={icon5} alt="" />
									</div>
									<div className="card-texts">
										<h3 className="gr-text-7 mb-7 heading-color gr-text-exerpt">
											Share with Designers
										</h3>
										<p className="gr-text-9 mb-0 text-color-opacity">
											Share the selected photos with your designers seamlessly,
											No hassles of HDD/WeTransfer/GDrive etc.
										</p>
									</div>
								</div>
							</Col>
							<Col lg="4" md="6" sm="6" xs="8" className="mb-lg-18 mb-9">
								<div className="feature-card d-flex flex-column flex-md-row ">
									<div className="card-icon me-8 mt-2 mb-9 mb-md-0">
										<img src={icon6} alt="" />
									</div>
									<div className="card-texts">
										<h3 className="gr-text-7 mb-7 heading-color gr-text-exerpt">
											Track progress
										</h3>
										<p className="gr-text-9 mb-0 text-color-opacity">
											Provide updates to your customers at every step of the
											journey.
										</p>
									</div>
								</div>
							</Col>
						</Row>
					</Container>
				</div>
			</PageWrapper>
		</>
	);
};
export default Pricing1;
