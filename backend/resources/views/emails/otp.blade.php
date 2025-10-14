<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>OTP Verification Code</title>
	</head>
	<body
		style="
			margin: 0;
			font-family: 'Segoe UI';
			color: #393e46;
			background-color: #f7f7f7;
		"
	>
		<table width="100%" cellpadding="0" cellspacing="0" border="0">
			<tr>
				<td align="center" style="padding: 1rem">
					<table
						width="500"
						cellpadding="0"
						cellspacing="0"
						border="0"
						style="
							background: white;
							border-radius: 0.5rem;
							box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.14),
								0px 0px 2px rgba(0, 0, 0, 0.12);
						"
					>
						<tr>
							<td align="center">
								<p
									style="
										font-size: 3em;
										font-weight: bold;
										margin-top: 1rem;
                                        margin-bottom: 1rem;
                                        color: #3361f2;
									"
								>
									MEC Template
								</p>
							</td>
						</tr>
						<tr>
							<td align="center">
								<div
									style="
										width: 150px;
										height: 3px;
										background: #d1d1d1;
										border-radius: 5px;
									"
								></div>
							</td>
						</tr>
						<tr>
							<td align="center">
								<h1
									style="
										margin-top: 0.5rem;
                                        margin-bottom: 1rem;
										font-size: 1.75em;
									"
								>
									Verification Code
								</h1>
							</td>
						</tr>
						<tr>
							<td align="center">
								<div
									style="
										padding: 0.5em;
										width: 80%;
										background: #efefef;
										border-radius: 0.5rem;
										display: flex;
										justify-content: center;
										align-items: center;
									"
								>
									<p
										style="
											margin: 0;
											font-weight: 600;
											font-size: 3em;
										"
									>
										{{ $data["otp"]}}
									</p>
								</div>
							</td>
						</tr>
						<tr>
							<td align="center" style="padding: 1rem; margin-top: 1rem; margin-bottom: 2rem;">
								<p
									style="
										margin: 0;
										font-size: 0.8em;
										font-weight: 500;
									"
								>
									Your OTP verification code is provided above.
								</p>
								<p
									style="
										margin: 0;
										font-size: 0.8em;
										font-weight: 500;
									"
								>
									<!-- It will expire in <b style="color: #ff414d">5 minutes</b>. -->
									Please use it within the next <b style="color: #ff414d">5 minutes</b> as it will expire afterward.
								</p>
								<p style="
										margin-top: 1rem;
										font-size: 0.8em;
										font-weight: 500;
									"
								>	
									For your security, <b style="color: #ff414d">DO NOT SHARE</b> this code with anyone.
								</p>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
</html>