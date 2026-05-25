"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./Hero.module.css";

export default function Hero({
  makes,
  minYear,
  maxYear,
  minPrice,
  maxPrice,
  heroImageUrl,
}) {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMinPrice, setSelectedMinPrice] = useState("");
  const [selectedMaxPrice, setSelectedMaxPrice] = useState("");
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isMinPriceOpen, setIsMinPriceOpen] = useState(false);
  const [isMaxPriceOpen, setIsMaxPriceOpen] = useState(false);

  const formRef = useRef(null);
  const containerRef = useRef(null);

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i,
  );

  const priceOptions = [
    { label: "₦3M", value: 3000000 },
    { label: "₦5M", value: 5000000 },
    { label: "₦10M", value: 10000000 },
    { label: "₦15M", value: 15000000 },
    { label: "₦20M", value: 20000000 },
    { label: "₦30M", value: 30000000 },
    { label: "₦50M", value: 50000000 },
    { label: "₦75M", value: 75000000 },
    { label: "₦100M", value: 100000000 },
    { label: "₦150M", value: 150000000 },
    { label: "₦200M", value: 200000000 },
    { label: "₦300M+", value: 300000000 },
  ];

  const closeAllDropdowns = () => {
    setIsBrandOpen(false);
    setIsYearOpen(false);
    setIsMinPriceOpen(false);
    setIsMaxPriceOpen(false);
  };

  // Click outside and Escape key handlers
  useEffect(() => {
    const onDocClick = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) closeAllDropdowns();
    };
    const onKey = (e) => {
      if (e.key === "Escape") closeAllDropdowns();
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (selectedBrand) params.append("make", selectedBrand);
    if (selectedYear) params.append("year", selectedYear);
    if (selectedMinPrice) params.append("minPrice", selectedMinPrice);
    if (selectedMaxPrice) params.append("maxPrice", selectedMaxPrice);

    const targetUrl = `/cars${params.toString() ? `?${params.toString()}` : ""}`;

    window.location.href = targetUrl;
  };

  return (
    <div
      className={styles.heroContainer}
      style={
        heroImageUrl ? { "--hero-image": `url(${heroImageUrl})` } : undefined
      }
    >
      <div className={styles.heroContent}>
        <div className={styles.searchCard} ref={containerRef}>
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <div className={styles.customSelect}>
                <button
                  className={`${styles.selectButton} ${isBrandOpen ? styles.active : ""}`}
                  onClick={() => {
                    if (isBrandOpen) {
                      setIsBrandOpen(false);
                    } else {
                      closeAllDropdowns();
                      setIsBrandOpen(true);
                    }
                  }}
                >
                  <span className={selectedBrand ? styles.selectedValue : ""}>
                    {selectedBrand || "Car Brand"}
                  </span>
                  <svg
                    className={`${styles.chevron} ${isBrandOpen ? styles.open : ""}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </button>
                {isBrandOpen && (
                  <div className={styles.optionsList}>
                    {makes.map((brand) => (
                      <div
                        key={brand}
                        className={styles.option}
                        onClick={() => {
                          setSelectedBrand(brand);
                          setIsBrandOpen(false);
                        }}
                      >
                        {brand}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.customSelect}>
                <button
                  className={`${styles.selectButton} ${isYearOpen ? styles.active : ""}`}
                  onClick={() => {
                    if (isYearOpen) {
                      setIsYearOpen(false);
                    } else {
                      closeAllDropdowns();
                      setIsYearOpen(true);
                    }
                  }}
                >
                  <span className={selectedYear ? styles.selectedValue : ""}>
                    {selectedYear || "Manufacturing Year"}
                  </span>
                  <svg
                    className={`${styles.chevron} ${isYearOpen ? styles.open : ""}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </button>
                {isYearOpen && (
                  <div className={styles.optionsList}>
                    {years.map((year) => (
                      <div
                        key={year}
                        className={styles.option}
                        onClick={() => {
                          setSelectedYear(year.toString());
                          setIsYearOpen(false);
                        }}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.customSelect}>
                <button
                  className={`${styles.selectButton} ${isMinPriceOpen ? styles.active : ""}`}
                  onClick={() => {
                    if (isMinPriceOpen) {
                      setIsMinPriceOpen(false);
                    } else {
                      closeAllDropdowns();
                      setIsMinPriceOpen(true);
                    }
                  }}
                >
                  <span
                    className={selectedMinPrice ? styles.selectedValue : ""}
                  >
                    {selectedMinPrice
                      ? priceOptions.find(
                          (p) => p.value === Number.parseInt(selectedMinPrice),
                        )?.label
                      : "Min Price"}
                  </span>
                  <svg
                    className={`${styles.chevron} ${isMinPriceOpen ? styles.open : ""}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </button>
                {isMinPriceOpen && (
                  <div className={styles.optionsList}>
                    {priceOptions.map((price) => (
                      <div
                        key={price.value}
                        className={styles.option}
                        onClick={() => {
                          setSelectedMinPrice(price.value.toString());
                          setIsMinPriceOpen(false);
                        }}
                      >
                        {price.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.customSelect}>
                <button
                  className={`${styles.selectButton} ${isMaxPriceOpen ? styles.active : ""}`}
                  onClick={() => {
                    if (isMaxPriceOpen) {
                      setIsMaxPriceOpen(false);
                    } else {
                      closeAllDropdowns();
                      setIsMaxPriceOpen(true);
                    }
                  }}
                >
                  <span
                    className={selectedMaxPrice ? styles.selectedValue : ""}
                  >
                    {selectedMaxPrice
                      ? priceOptions.find(
                          (p) => p.value === Number.parseInt(selectedMaxPrice),
                        )?.label
                      : "Max Price"}
                  </span>
                  <svg
                    className={`${styles.chevron} ${isMaxPriceOpen ? styles.open : ""}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </button>
                {isMaxPriceOpen && (
                  <div className={styles.optionsList}>
                    {priceOptions.map((price) => (
                      <div
                        key={price.value}
                        className={styles.option}
                        onClick={() => {
                          setSelectedMaxPrice(price.value.toString());
                          setIsMaxPriceOpen(false);
                        }}
                      >
                        {price.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button className={styles.searchButton} onClick={handleSearch}>
              <svg
                className={styles.searchIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path
                  d="m21 21-4.35-4.35"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
