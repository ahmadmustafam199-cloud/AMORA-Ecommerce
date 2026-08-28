import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
} from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-white p-6  text-gray-900">

      {/* Hero Section */}
      <section className="rounded-2xl bg-[#071a3a] py-6 text-white">
  <div className="mx-auto max-w-7xl px-5 text-center">

    <span className="mb-2 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
      We’re Here to Help
    </span>

    <h1 className="text-3xl font-bold ">
      Contact <span className="text-gray-300">AMORA</span>
    </h1>

    <p className="mx-auto mt-2 max-w-2xl text-[13px] leading-6 text-gray-300">
      Have a question, need assistance, or want to know more about our products?
      Our team is always ready to assist you with a smooth and enjoyable shopping
      experience. We’re committed to providing prompt, reliable support and
      ensuring every interaction with AMORA is seamless.
    </p>

  </div>
</section>

      {/* Main Contact Section */}
      <section className="px-2 pt-7 pb-5">
  <div className="mx-auto grid max-w-7xl grid-cols-1 gap-7 lg:grid-cols-2">

    {/* Left Side */}
    <div>
      <span className="text-xs font-semibold uppercase tracking-wider">
        Get In Touch
      </span>

      <h2 className="mt-1.5 mb-2 text-2xl font-bold md:text-3xl">
        We’d Love to Hear From You
      </h2>

      <p className="mb-4 max-w-xl text-sm leading-6 text-gray-600">
        Whether you have questions about an order, product, delivery, or any
        other concern, our dedicated support team is here to assist you. At
        AMORA, we value every customer and are committed to delivering prompt,
        reliable, and personalized support for a seamless shopping experience.
      </p>

      {/* Contact Details */}
      <div className="space-y-3">

        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3.5 transition hover:shadow-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#071a3a] text-white">
            <Mail size={19} />
          </div>

          <div>
            <h3 className="text-sm font-semibold">Email Us</h3>
            <p className="text-xs text-gray-600">
              support@amora.com
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3.5 transition hover:shadow-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#071a3a] text-white">
            <Phone size={19} />
          </div>

          <div>
            <h3 className="text-sm font-semibold">Call Us</h3>
            <p className="text-xs text-gray-600">
              +92 300 1234567
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3.5 transition hover:shadow-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#071a3a] text-white">
            <MapPin size={19} />
          </div>

          <div>
            <h3 className="text-sm font-semibold">Our Location</h3>
            <p className="text-xs text-gray-600">
              Lahore, Pakistan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3.5 transition hover:shadow-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#071a3a] text-white">
            <Clock size={19} />
          </div>

          <div>
            <h3 className="text-sm font-semibold">Business Hours</h3>
            <p className="text-xs text-gray-600">
              Monday - Saturday · 9:00 AM - 6:00 PM
            </p>
          </div>
        </div>

      </div>
    </div>

    {/* Right Side - Form */}
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-sm">

      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#071a3a] text-white">
          <MessageCircle size={19} />
        </div>

        <div>
          <h2 className="text-xl font-bold">
            Send Us a Message
          </h2>

          <p className="text-xs text-gray-500">
            We’ll get back to you as soon as possible.
          </p>
        </div>
      </div>

      {submitted && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-100 p-3 text-xs font-medium text-green-700">
          Your message has been sent successfully. Thank you for
          contacting AMORA!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">

        {/* Name */}
        <div>
          <label className="mb-1.5 block text-xs font-bold">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#114232] focus:ring-2 focus:ring-[#114232]/10"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-xs font-bold">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#114232] focus:ring-2 focus:ring-[#114232]/10"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="mb-1.5 block text-xs font-bold">
            Subject
          </label>

          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What can we help you with?"
            required
            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#114232] focus:ring-2 focus:ring-[#114232]/10"
          />
        </div>

        {/* Message */}
        <div>
          <label className="mb-1.5 block text-xs font-bold">
            Message
          </label>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            rows="4"
            required
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#114232] focus:ring-2 focus:ring-[#114232]/10"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#071a3a] py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-[#0f2953] hover:shadow-lg"
        >
          <Send size={17} />
          Send Message
        </button>

      </form>
    </div>

  </div>
</section>

      {/* Bottom Section */}
    <section>
  <div className="mx-auto max-w-7xl pt-4">
    <div className="rounded-2xl bg-[#071a3a] p-4 text-center text-white">

      <h2 className="mb-2 text-xl font-bold md:text-2xl">
        Your Satisfaction Matters to Us
      </h2>

      <p className="mx-auto max-w-2xl text-[13px] leading-6 text-gray-300">
        From product questions to order support, AMORA is committed to making
        your shopping experience simple, reliable, and enjoyable. Our dedicated
        team is always here to assist you with professional, responsive service
        and ensure every interaction meets the highest standard of customer care.
      </p>

    </div>
  </div>
</section>
    </div>
  );
}

export default Contact;