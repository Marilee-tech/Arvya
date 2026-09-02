import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },

        title: {
            type: String,
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        hour: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        comment: {
            type: String
        }
    },

    {
        timestamps: true
    }
);

export default mongoose.model("Appointment", appointmentSchema)