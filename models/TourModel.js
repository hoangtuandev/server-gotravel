import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    t_ma: {
        type: String,
        require: true,
    },
    t_ten: {
        type: String,
    },
    t_loaihinh: {
        type: Object,
    },
    t_thoigian: {
        type: Number,
    },
    t_gia: {
        type: Number,
    },
    t_hinhanh: {
        type: Array,
    },
    t_lichkhoihanh: {
        type: Array,
    },
    t_lichtrinhtour: {
        type: Array,
    },
});

export const TourModel = mongoose.model('Tour', schema);