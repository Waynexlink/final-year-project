import styles from "./CarCard.module.css";

export default function CarCard({ car }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const condition = car.condition || "Foreign Used";
  const isLocal = condition === "Locally Used";

  return (
    <article className={styles.carCard}>
      <a href={`/cars/${car.slug}`} className={styles.carCardLink}>
        {/* Image Section */}
        <div className={styles.imageSection}>
          <div className={styles.imageOverlay}></div>
          <img
            src={car.heroImage.src || "/placeholder.svg"}
            alt={car.heroImageAlt}
            loading="lazy"
            className={styles.carImage}
          />
          <div className={styles.priceOverlay}>{formatPrice(car.price)}</div>
          <div className={styles.titleOverlay}>
            {car.year} {car.make} {car.model}
          </div>
        </div>

        {/* Pill Bar */}
        <div className={styles.infoBar}>
          <span className={styles.pill}>{car.year}</span>
          <span className={styles.pill}>{car.transmission}</span>
          <span
            className={`${styles.pill} ${isLocal ? styles.pillLocal : styles.pillForeign}`}
          >
            {condition}
          </span>
        </div>
      </a>
    </article>
  );
}
