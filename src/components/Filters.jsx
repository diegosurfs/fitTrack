
import Tag from "@/src/components/Tag.jsx";

function FilterSelect({ label, options, value, onChange, name, icon }) {
  return (
    <div>
      <img src={icon} alt="" />
      <label>
        {label}
        <select value={value} onChange={onChange} name={name}>
          {options.map((option, index) => (
            <option value={option} key={index}>
              {option === "" ? "All" : option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default function Filters({ filters, setFilters }) {
  const handleSelectionChange = (event, name) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: event.target.value,
    }));
  };

  const updateField = (type, value) => {
    setFilters({ ...filters, [type]: value });
  };

  return (
    <section className="filter">
      <details className="filter-menu">
        <summary>
          <img src="/filter.svg" alt="" />
          <div>
            <p>Workouts</p>
            <p>Sorted by {filters.sort || "Rating"}</p>
          </div>
        </summary>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.currentTarget.closest("details")?.removeAttribute("open");
          }}
        >
          <FilterSelect
            label="Workout Category"
            options={[
              "",
              "Strength Training",
              "Full Body",
              "Cardio",
              "Core Training",
              "Weight Loss",
              "Muscle Building",
            ]}
            value={filters.category}
            onChange={(event) => handleSelectionChange(event, "category")}
            name="category"
            icon="/food.svg"
          />

          <FilterSelect
            label="Difficulty"
            options={[
              "",
              "Beginner",
              "Intermediate",
              "Advanced",
            ]}
            value={filters.city}
            onChange={(event) => handleSelectionChange(event, "city")}
            name="city"
            icon="/location.svg"
          />

          <FilterSelect
            label="Sort By"
            options={["Rating", "Reviews"]}
            value={filters.sort || "Rating"}
            onChange={(event) => handleSelectionChange(event, "sort")}
            name="sort"
            icon="/sortBy.svg"
          />

          <footer>
            <menu>
              <button
                className="button--cancel"
                type="reset"
                onClick={() =>
                  setFilters({
                    city: "",
                    category: "",
                    price: "",
                    sort: "",
                  })
                }
              >
                Reset
              </button>

              <button type="submit" className="button--confirm">
                Apply Filters
              </button>
            </menu>
          </footer>
        </form>
      </details>

      <div className="tags">
        {Object.entries(filters).map(([type, value]) => {
          if (type === "sort" || type === "price" || value === "") {
            return null;
          }

          return (
            <Tag
              key={type}
              type={type}
              value={value}
              updateField={updateField}
            />
          );
        })}
      </div>
    </section>
  );
}
