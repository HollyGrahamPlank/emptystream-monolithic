import mongoose, { HydratedDocument, Model, ObjectId, Schema, model } from "mongoose";
import { ITimestamps } from "./timestamps.js";
import { ALL_TRANSMISSION_STEMS, TransmissionStem } from "./transmissionStem.js";
import { ALL_CHANNEL_INDEX, ChannelIndex } from "./channelIndex.js";

export interface IChannelTuning {
  /** The index of the channel that this tuning represents. */
  index: ChannelIndex;

  /** Details about the transmission that this channel is tuned to. */
  transmission: {
    /** The ID of the transmission that this channel is tuned to. */
    id: ObjectId;

    /** The stem of the transmission that this channel is tuned to. */
    stem: TransmissionStem;
  };

  /** When this tuning started. */
  startTime?: Date;

  /**
   * How long it should take to go from some previous tuning settings to the tuning settings
   * described in this object.
   */
  transitionDuration?: Date;
}

export interface IStreamState {
  /** The explicit ID of this singleton. Should always be 0. */
  _id: number;

  /** The tunings for each channel on the stream. */
  tunings: IChannelTuning[];
}

export interface IStreamStateModel extends Model<IStreamState> {
  /** Returns the singleton stream state object from the DB. Creates one if it doesn't exist yet. */
  findOrCreateSingleton(): Promise<HydratedDocument<IStreamState>>;
}

export const ChannelTuningSchema = new Schema<IChannelTuning>(
  {
    index: { type: Number, required: true, enum: ALL_CHANNEL_INDEX },
    transmission: {
      type: new Schema<IChannelTuning["transmission"]>(
        {
          id: { type: mongoose.Types.ObjectId, required: true },
          stem: { type: String, required: true, enum: ALL_TRANSMISSION_STEMS },
        },
        { _id: false },
      ),
      required: true,
    },
    startTime: { type: Date, required: false },
    transitionDuration: { type: Date, required: false },
  },
  { _id: false },
);

export const StreamStateSchema = new Schema<IStreamState, IStreamStateModel>(
  {
    _id: { type: Number, enum: [0] },
    tunings: { type: [ChannelTuningSchema], required: true },
  },
  {
    _id: false,
    timestamps: true,
    statics: {
      /** Implements findOrCreateSingleton from IStreamStateModel. */
      async findOrCreateSingleton() {
        // Try to grab the singleton. If it exists, return it.
        const foundDoc = await this.findById(0);
        if (foundDoc) return foundDoc;

        // OTHERWISE - the singleton doesn't exist yet. Create it!
        const createdDoc = await this.create({ _id: 0, tunings: [] });
        return createdDoc;
      },
    },
  },
);

export const StreamState = model<IStreamState & ITimestamps, IStreamStateModel>(
  "StreamState",
  StreamStateSchema,
);
