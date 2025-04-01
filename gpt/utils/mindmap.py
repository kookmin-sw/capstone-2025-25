def build_mindmap_tree(nodes):
    node_dict = {node.id: {"summary": node.summary, "children": []} for node in nodes}

    root_node = None

    for node in nodes:
        if node.parentId is None:
            root_node = node_dict[node.id]
        else:
            node_dict[node.parentId]["children"].append(node_dict[node.id])  # 부모-자식 연결

    return root_node


def format_tree_for_gpt(node, depth=0):
    indent = "  " * depth
    text = f"{indent}- {node['summary']}\n"

    for child in node["children"]:
        text += format_tree_for_gpt(child, depth + 1)

    return text