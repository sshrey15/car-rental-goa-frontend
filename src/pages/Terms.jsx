import React from 'react'
import { Link } from 'react-router-dom'

const Terms = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Terms and Conditions</h1>
                    
                    <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 mb-6">
                            Last updated: December 22, 2025
                        </p>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-600 mb-4">
                                By accessing and using Car Rental Goa services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Eligibility Requirements</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>You must be at least 21 years of age to rent a vehicle</li>
                                <li>You must possess a valid driving license issued by a recognized authority</li>
                                <li>International visitors must have a valid International Driving Permit (IDP) along with their home country license</li>
                                <li>You must provide valid identification and contact information</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Booking and Reservation</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>All bookings are subject to vehicle availability</li>
                                <li>Booking confirmation will be sent via email after successful payment</li>
                                <li>The rental period begins at the pickup time and ends at the return time specified in your booking</li>
                                <li>Early returns do not qualify for refunds</li>
                                <li>Extensions must be requested at least 24 hours before the scheduled return time</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Payment Terms</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>All prices are displayed in Indian Rupees (₹)</li>
                                <li>Full payment or a deposit may be required at the time of booking</li>
                                <li>A security deposit may be required, which will be refunded upon safe return of the vehicle</li>
                                <li>Additional charges may apply for fuel, late returns, damages, or traffic violations</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Vehicle Use Restrictions</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>The vehicle must only be driven by the registered renter or authorized additional drivers</li>
                                <li>The vehicle must not be used for any illegal purposes</li>
                                <li>The vehicle must not be taken outside Goa state without prior written approval</li>
                                <li>Sub-letting or further rental of the vehicle is strictly prohibited</li>
                                <li>The vehicle must not be used for racing, towing, or any commercial purposes unless specifically agreed</li>
                                <li>Smoking in the vehicle is prohibited</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Vehicle Condition and Return</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>The vehicle must be returned in the same condition as it was received</li>
                                <li>The vehicle must be returned with the same fuel level as at pickup</li>
                                <li>Any damage, loss, or theft must be reported immediately</li>
                                <li>Late returns will incur additional charges at the daily rate</li>
                                <li>Failure to return the vehicle may result in legal action</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Insurance and Liability</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Basic insurance coverage is included in the rental price</li>
                                <li>The renter is responsible for the insurance excess amount in case of damage or accident</li>
                                <li>Damage due to negligence, drunk driving, or violation of terms is not covered</li>
                                <li>Personal belongings in the vehicle are not insured</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Accidents and Emergencies</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>In case of an accident, contact local police immediately and obtain a police report</li>
                                <li>Notify the vehicle owner and Car Rental Goa support as soon as possible</li>
                                <li>Do not admit fault or liability at the scene of an accident</li>
                                <li>Take photographs of any damage and collect contact details of witnesses</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">9. Cancellation Policy</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Free cancellation up to 48 hours before the pickup time</li>
                                <li>50% refund for cancellations between 24-48 hours before pickup</li>
                                <li>No refund for cancellations less than 24 hours before pickup</li>
                                <li>No-shows will be charged the full rental amount</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">10. Traffic Violations and Fines</h2>
                            <p className="text-gray-600 mb-4">
                                The renter is fully responsible for all traffic violations, parking tickets, and fines incurred during the rental period. Any fines received after the rental period will be forwarded to the renter, along with an administrative fee.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">11. Privacy and Data Protection</h2>
                            <p className="text-gray-600 mb-4">
                                We collect and process your personal information in accordance with our Privacy Policy. By using our services, you consent to such processing and you warrant that all data provided by you is accurate.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">12. Dispute Resolution</h2>
                            <p className="text-gray-600 mb-4">
                                Any disputes arising from or related to these terms shall be resolved through arbitration in Goa, India, in accordance with the Arbitration and Conciliation Act, 1996.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">13. Modifications to Terms</h2>
                            <p className="text-gray-600 mb-4">
                                Car Rental Goa reserves the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Continued use of our services after any changes constitutes acceptance of the new terms.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">14. Contact Information</h2>
                            <p className="text-gray-600">
                                For any questions or concerns regarding these Terms and Conditions, please contact us at:
                            </p>
                            <ul className="list-none text-gray-600 mt-2">
                                <li>Email: support@carrentalgoa.com</li>
                                <li>Phone: +91 XXXX XXXXXX</li>
                                <li>Address: Goa, India</li>
                            </ul>
                        </section>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <Link to="/" className="text-primary hover:underline">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Terms
