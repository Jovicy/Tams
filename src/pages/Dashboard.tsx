import React from 'react'
import { LuArrowRight, LuCircleAlert, LuShoppingBag, LuUsers } from 'react-icons/lu'
import { stats } from "../data/database";

const Dashboard = () => {
    return (
        <div className='container mx-auto px-4 py-8 md:py-10'>

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                <div>
                    <h1 className='font-playfair text-3xl md:text-4xl font-bold text-foreground'>
                        Welcome Guest
                    </h1>
                    <p className='text-muted-text mt-1'>
                        Manage your gold portfolio
                    </p>
                </div>

                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md border border-yellow-500/30 bg-yellow-500/20 text-yellow-400 text-sm font-medium">
                    <LuCircleAlert className='h-4 w-4' />
                    KYC Not Submitted
                </div>
            </div>

            {/* KYC ALERT */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">

                <div className="flex items-start sm:items-center gap-3">
                    <LuCircleAlert className='h-5 w-5 text-yellow-400 mt-1 sm:mt-0' />

                    <div>
                        <p className="font-medium text-foreground">
                            Complete your KYC verification
                        </p>
                        <p className='text-sm text-muted-text'>
                            Verify your identity to unlock all features
                        </p>
                    </div>
                </div>

                <a
                    href="/kyc"
                    className='inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md border border-yellow-500/30 bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 transition'
                >
                    Verify Now
                    <LuArrowRight className='h-4 w-4' />
                </a>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition"
                        >
                            <Icon className="h-5 w-5 text-primary mb-3" />

                            <p className="text-2xl md:text-3xl font-bold text-foreground">
                                {item.value}
                            </p>

                            <p className="text-sm text-muted-text mt-1">
                                {item.title}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* RECENT ORDERS */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-playfair text-lg md:text-xl font-semibold text-foreground">
                            Recent Orders
                        </h2>

                        <a
                            href="/shop"
                            className='text-sm text-primary flex items-center gap-1 hover:underline'
                        >
                            Browse
                            <LuArrowRight className='h-4 w-4' />
                        </a>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-8 text-center">
                        <LuShoppingBag className='h-8 w-8 text-muted-text mx-auto mb-3' />

                        <p className='text-muted-text'>
                            No orders yet
                        </p>

                        <a
                            href="/shop"
                            className='inline-flex items-center justify-center mt-4 px-4 py-2 text-xs font-medium rounded-md bg-primary text-black hover:opacity-90 transition'
                        >
                            Shop Now
                        </a>
                    </div>
                </div>

                {/* ACTIVE PLANS */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-playfair text-lg md:text-xl font-semibold text-foreground">
                            Active Plans
                        </h2>

                        <a
                            href="/plans"
                            className='text-sm text-primary flex items-center gap-1 hover:underline'
                        >
                            Browse
                            <LuArrowRight className='h-4 w-4' />
                        </a>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-8 text-center">
                        <LuUsers className='h-8 w-8 text-muted-text mx-auto mb-3' />

                        <p className='text-muted-text'>
                            No active plans yet
                        </p>

                        <a
                            href="/plans"
                            className='inline-flex items-center justify-center mt-4 px-4 py-2 text-xs font-medium rounded-md bg-primary text-black hover:opacity-90 transition'
                        >
                            Explore Plans
                        </a>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard