from .utils_basic import Monitor

def remove_index(bit_segments, index_binary_length=None, need_logs=False):
    if index_binary_length is None:
        index_binary_length = int(len(str(bin(len(bit_segments)))) - 2)

    if need_logs:
        print("Divide index and data from binary matrix.")

    monitor = Monitor()
    indices = []
    divided_matrix = []

    for row in range(len(bit_segments)):
        index, data = divide(bit_segments[row], index_binary_length)
        indices.append(index)
        divided_matrix.append(data)
        if need_logs:
            monitor.output(row + 1, len(bit_segments))

    return indices, divided_matrix


def divide(bit_segment, index_binary_length):
    # Convert binary index to decimal.
    index = int("".join(list(map(str, bit_segment[:index_binary_length]))), 2)
    divided_list = bit_segment[index_binary_length:]

    return index, divided_list