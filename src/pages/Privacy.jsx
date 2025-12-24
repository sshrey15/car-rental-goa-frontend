import React from 'react'
import { Link } from 'react-router-dom'

const Privacy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Privacy Policy</h1>
                    
                    <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 mb-6">
                            Last updated: December 22, 2025
                        </p>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
                            <p className="text-gray-600 mb-4">
                                Car Rental Goa ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our car rental platform.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Personal Information</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                                <li>Name and contact information (email, phone number)</li>
                                <li>Government-issued identification details</li>
                                <li>Driving license information</li>
                                <li>Payment information</li>
                                <li>Address and location data</li>
                            </ul>
                            
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Usage Information</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Booking history and preferences</li>
                                <li>Device and browser information</li>
                                <li>IP address and location data</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. How We Use Your Information</h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Process and manage your bookings</li>
                                <li>Verify your identity and driving eligibility</li>
                                <li>Process payments and refunds</li>
                                <li>Communicate with you about your bookings</li>
                                <li>Send promotional offers and updates (with your consent)</li>
                                <li>Improve our services and user experience</li>
                                <li>Prevent fraud and ensure platform security</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Information Sharing</h2>
                            <p className="text-gray-600 mb-4">
                                We may share your information with:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Vehicle owners to facilitate your booking</li>
                                <li>Payment processors to complete transactions</li>
                                <li>Insurance providers when required</li>
                                <li>Law enforcement when legally required</li>
                                <li>Service providers who assist in our operations</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Data Security</h2>
                            <p className="text-gray-600 mb-4">
                                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Your Rights</h2>
                            <p className="text-gray-600 mb-4">
                                You have the right to:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Access your personal information</li>
                                <li>Correct inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Object to processing of your data</li>
                                <li>Withdraw consent at any time</li>
                                <li>Data portability</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Cookies</h2>
                            <p className="text-gray-600 mb-4">
                                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookie preferences through your browser settings.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Data Retention</h2>
                            <p className="text-gray-600 mb-4">
                                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">9. Children's Privacy</h2>
                            <p className="text-gray-600 mb-4">
                                Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">10. Changes to This Policy</h2>
                            <p className="text-gray-600 mb-4">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">11. Contact Us</h2>
                            <p className="text-gray-600">
                                If you have questions about this Privacy Policy, please contact us at:
                            </p>
                            <ul className="list-none text-gray-600 mt-2">
                                <li>Email: privacy@carrentalgoa.com</li>
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

export default Privacy
