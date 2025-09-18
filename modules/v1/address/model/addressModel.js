import Address from "../../../../database/models/Address.js"
import User from "../../../../database/models/User.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"

export const newAddress = async (userId, data, make_default = false) => {
  const address = new Address({ ...data, userId })
  await address.validate()
  await address.save()

  await User.findOneAndUpdate(
    { _id: userId },
    {
      $push: {
        addresses: address._id,
      },
      ...(make_default
        ? {
            default_address: address._id,
          }
        : {}),
    }
  ).exec()

  return address.toObject()
}

export const updateAddress = async (address_id, update) => {
  return await Address.findOneAndUpdate({ _id: address_id }, { ...update }).exec()
}

export const deleteAddress = async (userId, address_id) => {
  const user = await User.findOne({ _id: userId }).exec()
  if (!user) throw new ErrorResponse("User not found", 404)

  const isAuthorized = user.addresses.some(add => {
    return add.toString() === address_id
  })

  if (!isAuthorized) {
    throw new ErrorResponse("Not your address to delete", 401)
  }

  return await Address.findByIdAndDelete(address_id).exec()
}

export const changeDefaultAddress = async (userId, address_id) => {
  const exists = await Address.exists({ _id: address_id }).exec()
  if (!exists) {
    throw new ErrorResponse("Not actual address", 404)
  }

  const user = await User.findOne({ _id: userId }).exec()
  if (!user) throw new ErrorResponse("User not founda", 404)

  if (!user.addresses.some(a => a.toString() === address_id)) {
    user.addresses.push(address_id)
  }

  user.default_address = address_id

  await user.save()

  return
}

export const getUserAddresses = async userId => {
  const addresses = await User.findOne({ _id: userId })
    .populate("addresses")
    .populate("default_address")
    .select("addresses default_address")
    .exec()
  if (!addresses) throw new ErrorResponse("No address found", 404)

  return addresses
}
