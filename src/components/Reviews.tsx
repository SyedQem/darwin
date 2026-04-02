export default function Reviews() {
  const reviews = [
    {
      name: "Sarah",
      school: "McMaster",
      text: "Sold my textbooks in 2 hours. Way easier than Facebook.",
    },
    {
      name: "Ahmed",
      school: "UofT",
      text: "Finally something built for students. Clean and actually useful.",
    },
    {
      name: "Maya",
      school: "Waterloo",
      text: "Feels safe and fast. I use it every week now.",
    },
  ];

  return (
    <section className="container-vspr flex w-full flex-col items-center py-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
        <div className="max-w-3xl text-center">
          <p className="section-label">
          TRUSTED BY STUDENTS
          </p>

          <h2 className="section-title-md mt-4">
            4.9 / 5 from 1,200+ student exchanges
          </h2>
          <p className="section-copy mx-auto mt-6 max-w-2xl">
            Fast listings and cleaner profiles matter, but trust is what makes students actually use the marketplace every week.
          </p>
        </div>

        <div className="mt-16 grid w-full max-w-6xl gap-6 md:grid-cols-3">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="surface-panel rounded-[24px] p-7 transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/14"
            >
              <div className="accent-text text-sm tracking-[0.18em]">★★★★★</div>
              <p className="mt-5 text-base leading-8 text-white/84">“{review.text}”</p>

              <div className="mt-6 border-t border-white/8 pt-4 text-sm text-white/64">
                <span className="font-medium text-white/88">{review.name}</span>
                {' · '}
                {review.school}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
