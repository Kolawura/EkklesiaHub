import React from "react";

export const LandingTestimonialSection = () => {
  return (
    <section id="testimonials" className="py-20 px-6 border-y border-border">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-foreground text-center mb-16">
          Loved by writers everywhere
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Chen",
              role: "Fiction Writer",
              quote:
                "WriterHub helped me find my audience. My stories now reach thousands of readers every month.",
              avatar: "SC",
            },
            {
              name: "Marcus Johnson",
              role: "Tech Blogger",
              quote:
                "The community features are incredible. I've built genuine connections with other writers in my niche.",
              avatar: "MJ",
            },
            {
              name: "Elena Rodriguez",
              role: "Poetry Creator",
              quote:
                "Finally, a platform that values writers. The tools and support here are unmatched.",
              avatar: "ER",
            },
          ].map((testimonial, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <p className="text-card-foreground/80 italic">{`"${testimonial.quote}"`}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
