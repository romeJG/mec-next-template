import CustomInput from "../customs/CustomInput";

function GeneralDetails({
	fullname,
	email,
	position,
	department,
	dateOfApplication,
	setDateOfApplication,
}) {
	return (
		<>
			<div className="w-full flex flex-col lg:grid grid-cols-2 gap-4">
				<CustomInput
					inputType="text"
					inputLabel="Full Name"
					inputValue={fullname}
					isDisabled
					isReadOnly
				/>
				<CustomInput
					inputType="text"
					inputLabel="Email"
					inputValue={email}
					isDisabled
					isReadOnly
				/>
			</div>
			<div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
				<CustomInput
					inputType="text"
					inputLabel="Reference Number"
					inputValue="--Auto Generated--"
					isDisabled
					isReadOnly
				/>
				<CustomInput
					inputType="text"
					inputLabel="Position"
					inputValue={position}
					isReadOnly
					isDisabled
				/>
			</div>
			<div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
				<CustomInput
					inputType="text"
					inputLabel="Department"
					inputValue={department}
					isReadOnly
					isDisabled
				/>
				<CustomInput
					inputType="date"
					inputLabel="Date of Application"
					inputValue={dateOfApplication}
					setInputValue={setDateOfApplication}
					isRequired
				/>
			</div>
		</>
	);
}

export default GeneralDetails;
