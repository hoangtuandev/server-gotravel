import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    ldt_tour: {
        type: Object,
    },
    ldt_lichkhoihanh: {
        type: Object,
    },
    ldt_huongdanvien: {
        type: Array,
    },
});

export const CalendarGuideModel = mongoose.model('LichDanTour', schema);
