import React from "react";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const ContactUs = () => {
  return (
    <section className="w-full bg-black text-white py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 border border-gray-700 p-10 rounded-xl">

        {/* LEFT SIDE TEXT + INFO */}
        <div>
          <p className="text-gray-400 text-lg font-medium">
            We're Here to Help!
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mt-3">
            Questions About  
            <br />
            <span className="text-purple-500">TryNex?</span>
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Whether it's AI try-ons, brand partnerships, API access, styling tools, 
            or general support — reach out and we’ll get back to you soon.
          </p>

          <div className="mt-10 space-y-6">

            {/* Phone */}
            <div className="flex items-center gap-4">
              <Phone className="text-purple-500 w-6 h-6" />
              <p className="text-gray-300 text-lg">+91 80695 09347</p>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <Mail className="text-purple-500 w-6 h-6" />
              <p className="text-gray-300 text-lg">support@trynex.ai</p>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <MapPin className="text-purple-500 w-6 h-6 mt-1" />
              <p className="text-gray-300 text-lg">
                TryNex HQ<br />
                Sector 8, Noida — 201301
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div>
          <form className="space-y-6">

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-300 text-sm">Full Name*</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-black border border-gray-500 rounded-xl px-4 py-3 mt-2 
                             focus:border-purple-500 focus:ring-0 outline-none transition"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm">Email*</label>
                <input
                  type="email"
                  placeholder="example@domain.com"
                  className="w-full bg-black border border-gray-500 rounded-xl px-4 py-3 mt-2
                             focus:border-purple-500 focus:ring-0 outline-none transition"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-300 text-sm">Reason for Contact*</label>
                <input
                  type="text"
                  placeholder="Try-On Issue, Partnership, API Access, etc."
                  className="w-full bg-black border border-gray-500 rounded-xl px-4 py-3 mt-2
                             focus:border-purple-500 focus:ring-0 outline-none transition"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm">Mobile*</label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  className="w-full bg-black border border-gray-500 rounded-xl px-4 py-3 mt-2
                             focus:border-purple-500 focus:ring-0 outline-none transition"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-gray-300 text-sm">Your Message*</label>
              <textarea
                rows="6"
                placeholder="Tell us what you're looking for, or how we can help..."
                className="w-full bg-black border border-gray-500 rounded-xl px-4 py-3 mt-2 
                           focus:border-purple-500 focus:ring-0 outline-none transition resize-none"
              ></textarea>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 
                         text-white font-semibold px-8 py-3 rounded-xl transition mt-4"
            >
              Send Message <ArrowRight className="w-5 h-5" />
            </button>

          </form>
        </div>

      </div>
    </section>
  );
};

export default ContactUs;
