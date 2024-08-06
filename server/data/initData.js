const mongoose = require('mongoose');
const { User } = require('../models/User');
const { Task } = require('../models/Task');
const bcrypt = require('bcrypt');
const { ObjectId } = mongoose.Types;

const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

const initData = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/TaskBoardData', { useNewUrlParser: true, useUnifiedTopology: true });

        console.log('Connected to MongoDB');

        const users = [
            {
                _id: new ObjectId("60d5f9d7f9d8b9425c2a2f96"),
                username: "John Doe",
                email: "john.doe@example.com",
                password: await hashPassword("hashed_password1"),
                createdTasks: [
                    
                    new ObjectId("60d5f9d7f9d8b9425c2a2f04"),
                    new ObjectId("60d5f9d7f9d8b9425c2a2f08")
                ],
                takenTasks: [new ObjectId("60d5f9d7f9d8b9425c2a2f03")],
                completedTasks: [new ObjectId("60d5f9d7f9d8b9425c2a2f03")],
                archivedTasks: [new ObjectId("60d5f9d7f9d8b9425c2a2f01")]
            },
            {
                _id: new ObjectId("60d5f9d7f9d8b9425c2a2f97"),
                username: "Jane Smith",
                email: "jane.smith@example.com",
                password: await hashPassword("hashed_password2"),
                createdTasks: [
                    new ObjectId("60d5f9d7f9d8b9425c2a2f05"),
                    new ObjectId("60d5f9d7f9d8b9425c2a2f09"),
                    new ObjectId("60d5f9d7f9d8b9425c2a2f03")
                ],
                takenTasks: [new ObjectId("60d5f9d7f9d8b9425c2a2f01")],
                completedTasks: [new ObjectId("60d5f9d7f9d8b9425c2a2f01")],
                archivedTasks: [
                    new ObjectId("60d5f9d7f9d8b9425c2a2f05"),
                    new ObjectId("60d5f9d7f9d8b9425c2a2f03")
                ]
            },
            {
                _id: new ObjectId("60d5f9d7f9d8b9425c2a2f98"),
                username: "Alex Jones",
                email: "alex.jones@example.com",
                password: await hashPassword("hashed_password3"),
                createdTasks: [
                    new ObjectId("60d5f9d7f9d8b9425c2a2f02"),
                    new ObjectId("60d5f9d7f9d8b9425c2a2f06"),
                    new ObjectId("60d5f9d7f9d8b9425c2a2f10")
                ],
                takenTasks: [
                    new ObjectId("60d5f9d7f9d8b9425c2a2f04"),
                    new ObjectId("60d5f9d7f9d8b9425c2a2f05")
                ],
                completedTasks: [new ObjectId("60d5f9d7f9d8b9425c2a2f05")],
                archivedTasks: []

            }
        ];

        const tasks = [
            {
                _id: new ObjectId("60d5f9d7f9d8b9425c2a2f01"),
                name: "Complete project report",
                description: "Finish the final report for the ABC project",
                image: "projectReport.png",
                deadline: new Date("2024-05-31T23:59:59.000Z"),
                createdBy: new ObjectId("60d5f9d7f9d8b9425c2a2f96"),
                takenBy: new ObjectId("60d5f9d7f9d8b9425c2a2f97"),
                completed: true,
                completedBy: new ObjectId("60d5f9d7f9d8b9425c2a2f97")
            },
            {
                _id: new ObjectId("60d5f9d7f9d8b9425c2a2f02"),
                name: "Client meeting preparation",
                description: "Prepare slides for the upcoming client meeting",
                image: "slidesForMeeting.png",
                deadline: new Date("2024-11-30T23:59:59.000Z"),
                createdBy: new ObjectId("60d5f9d7f9d8b9425c2a2f98"),
                takenBy: new ObjectId("60d5f9d7f9d8b9425c2a2f97"),
                completed: true,
                completedBy: new ObjectId("60d5f9d7f9d8b9425c2a2f97")
            },
            {
                _id: new ObjectId("60d5f9d7f9d8b9425c2a2f03"),
                name: "Update website content",
                description: "Revise and update the content on the company website",
                image: "websiteContent.png",
                deadline: new Date("2024-03-14T23:59:59.000Z"),
                createdBy: new ObjectId("60d5f9d7f9d8b9425c2a2f98"),
                takenBy: new ObjectId("60d5f9d7f9d8b9425c2a2f96"),
                completed: true,
                completedBy: new ObjectId("60d5f9d7f9d8b9425c2a2f96")
            },
            {
                _id: new ObjectId("60d5f9d7f9d8b9425c2a2f04"),
                name: "Develop new feature",
                description: "Develop and test the new feature for the mobile app",
                image: "newFeature.png",
                deadline: new Date("2024-09-30T23:59:59.000Z"),
                createdBy: new ObjectId("60d5f9d7f9d8b9425c2a2f96"),
                takenBy: null,
                completed: false,
                completedBy: null
            },
            {
                _id: new ObjectId("60d5f9d7f9d8b9425c2a2f05"),
                name: "Conduct code review",
                description: "Review the code for the new module",
                image: "codeReview.png",
                deadline: new Date("2024-02-20T23:59:59.000Z"),
                createdBy: new ObjectId("60d5f9d7f9d8b9425c2a2f97"),
                takenBy: null,
                completed: false,
                completedBy: null
            },
            {
                _id: new ObjectId("60d5f9d7f9d8b9425c2a2f06"),
                name: "Organize team building event",
                description: "Plan and organize the next team building event",
                image: "organizeTeamBuildings.png",
                deadline: new Date("2024-09-15T23:59:59.000Z"),
                createdBy: new ObjectId("60d5f9d7f9d8b9425c2a2f98"),
                takenBy: null,
                completed: false,
                completedBy: null
            },
            {
                _id: new ObjectId("60d5f9d7f9d8b9425c2a2f07"),
                name: "Prepare budget proposal",
                description: "Prepare the budget proposal for the next quarter",
                image: "budgetProposal.png",
                deadline: new Date("2024-10-03T23:59:59.000Z"),
                createdBy: new ObjectId("60d5f9d7f9d8b9425c2a2f96"),
                takenBy: new ObjectId("60d5f9d7f9d8b9425c2a2f97"),
                completed: false,
                completedBy: null
            },
            {
                _id: new ObjectId("60d5f9d7f9d8b9425c2a2f08"),
                name: "Analyze market trends",
                description: "Analyze the latest market trends and prepare a report",
                image: "marketTrends.png",
                deadline: new Date("2024-10-31T23:59:59.000Z"),
                createdBy: new ObjectId("60d5f9d7f9d8b9425c2a2f96"),
                takenBy: null,
                completed: false,
                completedBy: null
            },
            {
                _id: new ObjectId("60d5f9d7f9d8b9425c2a2f09"),
                name: "Monthly Performance Review",
                description: "Conduct a review meeting to evaluate the team's monthly performance and set goals for the next month.",
                image: "monthlyPerformance.png",
                deadline: new Date("2024-12-08T23:59:59.000Z"),
                createdBy: new ObjectId("60d5f9d7f9d8b9425c2a2f97"),
                takenBy: new ObjectId("60d5f9d7f9d8b9425c2a2f96"),
                completed: false,
                completedBy: null
            },
            {
                _id: new ObjectId("60d5f9d7f9d8b9425c2a2f10"),
                name: "Customer Feedback Analysis",
                description: "Analyze customer feedback to identify common issues and areas for improvement.",
                image: "customerFeedback.png",
                deadline: new Date("2024-12-12T23:59:59.000Z"),
                createdBy: new ObjectId("60d5f9d7f9d8b9425c2a2f98"),
                takenBy: new ObjectId("60d5f9d7f9d8b9425c2a2f97"),
                completed: false,
                completedBy: null
            }
        ];

        await User.deleteMany({});
        await Task.deleteMany({});

        await User.insertMany(users);
        await Task.insertMany(tasks);

        console.log('Data initialized successfully!');
    } catch (error) {
        console.error('Error initializing data:', error);
    } finally {
        await mongoose.connection.close();
    }
};

initData();
