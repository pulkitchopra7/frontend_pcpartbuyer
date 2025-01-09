const Stars = (no) => {
  let arr = [];
  for (let i = 0; i < 5; i++) {
    const percentage = Math.min((no - i) * 100, 100);
    arr.push(
      <span
        key={i}
        id={i}
        style={{
          fontSize: "1rem",
          backgroundImage: `linear-gradient(90deg,rgb(222,121,33) ${percentage}%, grey ${percentage}%)`,
          WebkitBackgroundClip: "text", //clips background to text in foreground
          WebkitTextFillColor: "transparent", //makes text transparent making background color visible
        }}
      >
        &#9733;
      </span>
    );
  }

  return arr;
};

export default Stars;
