import classes from "./AboutUs.module.css";

export default function AboutUs() {
  return (
    <div className={classes.aboutUs}>
      <h1>Introduction</h1>
      <hr />
      <br />
      <p>
        Welcome to PcPartBuyer, where shopping meets convenience and variety.
        Our goal is to provide you with an unparalleled online shopping
        experience, bringing a vast selection of computer parts right to your
        fingertips. Founded with a passion for innovation and customer
        satisfaction, we strive to be your go-to destination for all your
        shopping needs.
      </p>
      <br />
      <br />

      <h3>What We Offer</h3>
      <hr />
      <br />
      <p>
        Explore an extensive collection of products across various categories,
        including cpu, gpu, ram, psu, cabinet, computer fans and so on. Take
        advantage of our exclusive deals and discounts to save while building
        new pcs or supercharging your setup with latest tech. Enjoy fast and
        reliable shipping options to get your products delivered to your
        doorstep promptly.Shop with confidence knowing that we offer hassle-free
        returns and exchanges.
      </p>
      <br />
      <br />

      <h3>Our Mission</h3>
      <hr />
      <br />
      <ul>
        <li>
          To offer a diverse range of high-quality products at competitive
          prices.
        </li>
        <li>
          To ensure a seamless and enjoyable shopping experience from start to
          finish.
        </li>
        <li>
          To provide excellent customer service that goes above and beyond
          expectations.
        </li>
      </ul>
    </div>
  );
}
