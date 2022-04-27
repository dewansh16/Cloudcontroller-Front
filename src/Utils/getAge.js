const getAge = (current, dob) => {
    let age = (current.getTime() - dob.getTime()) / 1000;
    age /= (60 * 60 * 24);
    return Math.abs(Math.round(age / 365.25));
}

export default getAge;