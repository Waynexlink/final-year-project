"use client";

import { useState, useMemo, useEffect } from "react";
import CarCard from "./CarCard";
import styles from "./CarInventory.module.css";

function getInitialFiltersFromUrl() {
  if (typeof window === "undefined") return {};

  try {
    const params = new URLSearchParams(window.location.search);
    return {
      make: params.get("make") || params.get("brand") || "",
      year: params.get("year") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      transmission: params.get("transmission") || "",
    };
  } catch (err) {
    console.error("[v0 CarInventory] Failed to parse URL params:", err);
    return {};
  }
}

export default function CarInventory({ cars, makes, minYear, maxYear }) {
  const initialFilters = getInitialFiltersFromUrl();

  // Filter visibility state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter state - initialized from URL params
  const [selectedMake, setSelectedMake] = useState(initialFilters.make || "");
  const [selectedYear, setSelectedYear] = useState(initialFilters.year || "");
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || "");
  const [selectedTransmission, setSelectedTransmission] = useState(
    initialFilters.transmission || "",
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 9; // Updated from 12 to 9 cars per page

  useEffect(() => {
    const handlePopState = () => {
      const filters = getInitialFiltersFromUrl();
      setSelectedMake(filters.make || "");
      setSelectedYear(filters.year || "");
      setMinPrice(filters.minPrice || "");
      setMaxPrice(filters.maxPrice || "");
      setSelectedTransmission(filters.transmission || "");
      setCurrentPage(1);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Generate year options
  const yearOptions = [];
  for (let year = maxYear; year >= minYear; year--) {
    yearOptions.push(year);
  }

  const filteredCars = useMemo(() => {
    const result = cars.filter((car) => {
      const carPrice =
        typeof car.price === "string"
          ? Number(car.price.replace(/,/g, ""))
          : car.price;

      const checks = {
        makeCheck: !selectedMake || car.make === selectedMake,
        yearCheck: !selectedYear || car.year === Number.parseInt(selectedYear),
        minPriceCheck: !minPrice || carPrice >= Number.parseInt(minPrice),
        maxPriceCheck: !maxPrice || carPrice <= Number.parseInt(maxPrice),
        transmissionCheck:
          !selectedTransmission || car.transmission === selectedTransmission,
      };

      return Object.values(checks).every(Boolean);
    });

    return result;
  }, [
    cars,
    selectedMake,
    selectedYear,
    minPrice,
    maxPrice,
    selectedTransmission,
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedMake("");
    setSelectedYear("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedTransmission("");
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters =
    selectedMake ||
    selectedYear ||
    minPrice ||
    maxPrice ||
    selectedTransmission;

  return (
    <section className={styles.carInventory}>
      <div className={styles.inventoryContainer}>
        {/* Filter Toggle Button */}
        <div className={styles.filterToggle}>
          <button
            className={styles.filterToggleBtn}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-expanded={isFilterOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="20"
              height="20"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filter Cars
            {hasActiveFilters && (
              <span className={styles.filterBadge}>
                {
                  Object.values({
                    selectedMake,
                    selectedYear,
                    minPrice,
                    maxPrice,
                    selectedTransmission,
                  }).filter(Boolean).length
                }
              </span>
            )}
          </button>
        </div>

        {/* Collapsible Filter Bar */}
        <div
          className={`${styles.filterBar} ${isFilterOpen ? styles.filterBarOpen : ""}`}
        >
          <div className={styles.filterContent}>
            <div className={styles.filterGroup}>
              <label htmlFor="make-filter">Make/Brand</label>
              <select
                id="make-filter"
                value={selectedMake}
                onChange={(e) => {
                  setSelectedMake(e.target.value);
                  handleFilterChange();
                }}
              >
                <option value="">All Makes</option>
                {makes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="year-filter">Year</label>
              <select
                id="year-filter"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  handleFilterChange();
                }}
              >
                <option value="">All Years</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="min-price">Min Price (₦)</label>
              <input
                id="min-price"
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  handleFilterChange();
                }}
              />
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="max-price">Max Price (₦)</label>
              <input
                id="max-price"
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  handleFilterChange();
                }}
              />
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="transmission-filter">Transmission</label>
              <select
                id="transmission-filter"
                value={selectedTransmission}
                onChange={(e) => {
                  setSelectedTransmission(e.target.value);
                  handleFilterChange();
                }}
              >
                <option value="">All Types</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button className={styles.resetBtn} onClick={resetFilters}>
                Reset All
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className={styles.resultsInfo}>
          <p>
            Showing {currentCars.length} of {filteredCars.length} cars
          </p>
        </div>

        {/* Car Grid */}
        {currentCars.length > 0 ? (
          <div className={styles.carGrid}>
            {currentCars.map((car) => (
              <CarCard key={car.slug} car={car} />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <h3>No cars found</h3>
            <p>Try adjusting your filters to see more results.</p>
            <button className={styles.resetBtn} onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={styles.pageBtn}
            >
              Previous
            </button>

            <div className={styles.pageNumbers}>
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`${styles.pageBtn} ${currentPage === pageNum ? styles.active : ""}`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return <span key={pageNum}>...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={styles.pageBtn}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
